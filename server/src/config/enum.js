const roles = ['admin'];

const roleRights = new Map();

// Set common permissions
roles.forEach((role) => {
  roleRights.set(role, ['session', 'admin']);
});

module.exports = {
  roles,
  roleRights,
};
