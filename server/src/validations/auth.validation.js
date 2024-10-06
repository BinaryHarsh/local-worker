const Joi = require('@hapi/joi');

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  login,
  logout,
};
