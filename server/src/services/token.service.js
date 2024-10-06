const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { db } = require('../models');

const generateToken = (id, secret = config.jwt.secret) => {
  const expirationDate = moment().add(1, 'year');
  const expirationSeconds = expirationDate.unix();
  const payload = {
    sub: id,
    exp: expirationSeconds,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, id, expires) => {
  const checktoken = await db.tokens.findOne({ where: { id: id } });
  if (checktoken) {
    await db.tokens.update(
      {
        id,
        token,
        expiry: expires,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { where: { id: id } }
    );
  } else
    await db.tokens.create({
      id,
      token,
      expiry: expires,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
};

const generateAuthTokens = async (id) => {
  const accessToken = generateToken(id);
  const expires = moment().add(1, 'year').toISOString();
  // await saveToken(accessToken, id, expires);
  return {
    access: {
      token: accessToken,
      expires,
    },
  };
};

module.exports = {
  generateAuthTokens,
};
