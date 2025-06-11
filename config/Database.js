import { Sequelize } from "sequelize"; 

const db = new Sequelize('projek_pemjut', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
})

export default db;