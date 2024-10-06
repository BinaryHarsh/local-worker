/* eslint-disable */
const { ROLES } = require('../config/tables')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(ROLES, {
    id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    timestamps: false,
    freezeTableName: true
  });
}
