const bcrypt = require('bcryptjs');
const { db, sequelize } = require('../models');
const { Op } = require('sequelize');

// get All Users
const getUsers = async ({ page, limit, search }) => {
  const searchQuery =
    search && search != ''
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { mobile: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

  const getUsers = await db.users.findAll({
    include: [{ model: db.logins, attributes: ['username', 'status'] }],
    where: searchQuery,
    offset: (page - 1) * limit,
    limit: limit,
  });
  return getUsers;
};

// get user by Id
const getUserById = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

//create new user
const createNewUser = async (body) => {
  const t = await sequelize.transaction();
  try {
    if (!/^\d{10}$/.test(body.mobile)) {
      throw new Error(`Mobile number must be exactly 10 digits. Given: ${body.mobile}`);
    }
    const checkUsername = await db.logins.findOne({ where: { username: body.username } });

    if (checkUsername) {
      throw new Error('username already exist');
    }

    const checkEmailOrMobile = await db.users.findOne({
      where: { [Op.or]: [{ mobile: body.mobile }, { email: body.email }] },
      raw: true,
    });

    if (checkEmailOrMobile) {
      if (checkEmailOrMobile.mobile == body.mobile) {
        throw new Error(`Given mobile no: ${body.mobile} already exist user`);
      }

      if (checkEmailOrMobile.email == body.email) {
        throw new Error(`Given email Id: ${body.mobile} already exist user`);
      }
    }

    const checkRoleName = await db.roles.findOne({ where: { role_name: body.roleName } });

    if (!checkRoleName) {
      throw new Error(`Invalid Role Name ${body.roleName}`);
    }

    const createUser = await db.users.create(
      {
        first_name: body.firstName,
        last_name: body.lastName,
        role_name: body.roleName,
        mobile: body.mobile,
        email: body.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { transaction: t }
    );
    

    await db.logins.create(
      {
        user_id: createUser.id,
        username: body.username,
        password: await bcrypt.hash(body.password, 8),
        is_logged_in: 0,
        status: 'active',
      },
      { transaction: t }
    );
    await t.commit();

    return true;
  } catch (error) {
    await t.rollback();
    throw new Error(error);
  }
};

// update User
const updateUser = async (id, updatedData) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }
  if (!/^\d{10}$/.test(updatedData.mobile)) {
    throw new Error(`Mobile number must be exactly 10 digits. Given: ${updatedData.mobile}`);
  }

  user.first_name = updatedData.firstName;
  user.last_name = updatedData.lastName;
  user.role_name = updatedData.roleName;
  user.mobile = updatedData.mobile;
  user.email = updatedData.email;
  user.updated_at = new Date().toISOString();

  // Update logins table
  const login = await db.logins.findOne({ where: { user_id: id } });
  if (login) {
    login.username = updatedData.username;
    login.password = updatedData.password ? await bcrypt.hash(updatedData.password, 8) : login.password;
    login.updated_at = new Date().toISOString();
    await login.save();
  }

  await user.save();
  return true;
};

// delete  User
const deleteUser = async (userId) => {
  const user = await db.users.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Delete the user from users
  await db.users.destroy({ where: { id: userId } });

  // Delete user from logins
  await db.logins.destroy({ where: { user_id: userId } });

  // Delete user from tms_user_role mappings
  await db.tms_user_role_mappings.destroy({ where: { user_id: userId } });

  // Delete user from tms_user_shift_mappings
  await db.tms_user_shift_mappings.destroy({ where: { user_id: userId } });

  return { message: 'User deleted successfully' };
};

// get All roles

const getRoles = async () => {
  const data = await db.roles.findAll({});
  return data;
};

// change account status
const changeStatus = async (id) => {
  const checkUser = await db.logins.findOne({ where: { user_id: id } });

  if (!checkUser) {
    throw new Error(`Invalid User Id`);
  }

  await db.logins.update({ status: checkUser.status == 'active' ? 'deactive' : 'active' }, { where: { user_id: id } });

  return;
};
module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createNewUser,
  getRoles,
  changeStatus,
};
