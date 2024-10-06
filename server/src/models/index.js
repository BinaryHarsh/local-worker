/* eslint-disable */
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');
let sequelize = null;
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};
let dbStatus = false;

sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 10000,
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    fs.readdirSync(__dirname)
      .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
      })
      .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
      });

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    dbStatus = true;
    logger.info(`Connected to MySQL`);
  })
  .catch((err) => {
    logger.error(err);
    process.exit();
    dbStatus = false;
  });

const isDBConnected = () => {
  return dbStatus;
};

module.exports = {
  db,
  sequelize,
  isDBConnected,
};
