/* eslint-disable security/detect-possible-timing-attacks */
const bcrypt = require('bcryptjs');
const { db } = require('../models');
const logger = require('../config/logger');
const { raw } = require('body-parser');

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (username, password) => {
  const loginRes = await db.logins.findOne({ where: { username },raw:true });
  if (loginRes == null) {
    throw new Error('Account with the username does not exist');
  }

  const user = loginRes;

  // CHECK PASSWORD
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Incorrect Password');
  }

  // // CHECK USER STATUS
  // if (!user.status_id || user.status_id !== 1) {
  //   throw new Error('Account Suspended');
  // }

  // UPDATE LAST LOGIN TIME
  await db.logins.update({ is_logged_in: true }, { where: { user_id: user.user_id } });
  // await db.auth_logs.create({ last_login: new Date().toISOString(), user_id: user.user_id });

  // GET USER DETAILS
  const userDetails = await db.users.findOne({ where: { id: user.user_id } ,raw:true});
  const role = await db.user_role_mappings.findOne({ where: { user_id: user.user_id },raw:true });
  const roleName = await db.roles.findOne({ where: { id: role.role_id },raw:true });

  return { ...userDetails, role: roleName.role_name };
};

/**
 * Logout user
 * @param {*} userId
 * @returns
 */
const logoutUser = async (userId) => {
  await db.logins.update({ is_logged_in: false }, { where: { user_id: userId } });
  return true;
};

const getUserPermissions = async (userId) => {
  try {
    const role = await db.user_role_mappings.findOne({ where: { user_id: userId } });
    if (!role) return false;

    const permissions = await db.sequelize.query(`
          SELECT
          m.id,
          m.module_name,
          rmm.permission,
          (
            SELECT JSON_ARRAYAGG(JSON_OBJECT (
            'sub_module_name', sm.sub_module_name,
            'permission', rsm.permission ))
            FROM SUB_MODULES sm
            INNER JOIN ROLE_SUB_MODULE_MAPPINGS rsm
            ON sm.id = rsm.sub_module_id
            WHERE rsm.role_id = ${role.role_id} AND
              sm.parent_module_id = rmm.module_id) as 'sub_modules'
          FROM MODULES m
          INNER JOIN ROLE_MODULE_MAPPINGS rmm
          ON m.id = rmm.module_id
          WHERE rmm.role_id = ${role.role_id}
    `);

    if (permissions[0].length === 0) return false;
    return permissions[0];
  } catch (e) {
    logger.error('getUserPermissions: ' + e);
    return false;
  }
};

module.exports = {
  login,
  logoutUser,
  getUserPermissions,
};
