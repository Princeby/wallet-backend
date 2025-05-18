import { Sequelize } from 'sequelize';
import { config } from './env';

const sequelize = new Sequelize({
  database: config.dbConfig.database,
  username: config.dbConfig.username,
  password: config.dbConfig.password,
  host: config.dbConfig.host,
  port: config.dbConfig.port,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;