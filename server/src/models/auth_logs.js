/* eslint-disable */
const { AUTH_LOGS } = require('../config/tables');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    AUTH_LOGS,
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      last_login: {
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
