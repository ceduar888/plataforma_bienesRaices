import Sequelize  from "sequelize";
import Dotenv from "dotenv";

Dotenv.config({path: '.env'})

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db

