"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
const sequelize = new sequelize_1.Sequelize({
    database: env_1.config.dbConfig.database,
    username: env_1.config.dbConfig.username,
    password: env_1.config.dbConfig.password,
    host: env_1.config.dbConfig.host,
    port: env_1.config.dbConfig.port,
    dialect: 'postgres',
    logging: false,
});
exports.default = sequelize;
