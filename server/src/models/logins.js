/* eslint-disable */
const { LOGINS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    LOGINS,
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      is_logged_in: {
        type: DataTypes.BOOLEAN,
      },
      password: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.NUMBER,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
    }
  );
};
