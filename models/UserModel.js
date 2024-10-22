const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define('m_users', {  
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password: DataTypes.STRING,
    jwt_token: DataTypes.STRING
}, {
    freezeTableName: true  
});

module.exports = User;  

const syncDatabase = async () => {
    try {
        await db.sync();
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error synchronizing database:", error);  
    }
};

syncDatabase();
