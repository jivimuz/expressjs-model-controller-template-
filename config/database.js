const { Sequelize } = require("sequelize");
require('dotenv').config();

const dbName = process.env.DB_NAME || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbhost = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
}

const db = new Sequelize(dbName, dbUser, dbPass, dbhost)

module.exports = db;