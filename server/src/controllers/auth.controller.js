const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, mapService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.login(username, password);
  const token = await tokenService.generateAuthTokens(user.id);
  // const permissions = await authService.getUserPermissions(user.id)
  // if (!permissions || permissions.length === 0) throw new Error('User not configured. Please contact administratior.')

  res.send({ status: true, token, user });
});

const logout = catchAsync(async (req, res) => {
  const { id } = req.body;
  await authService.logoutUser(id);
  res.status(httpStatus.OK).send('Ok');
});

module.exports = {
  login,
  logout,
};
