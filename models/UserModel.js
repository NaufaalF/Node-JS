import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const User = db.define('users', {
    nama:DataTypes.STRING,
    email:DataTypes.STRING,
    password:DataTypes.STRING,
    role:DataTypes.ENUM('anggota', 'admin')
}, {
    freezeTableName: true,
   });

export default User;

(async () => {
    await db.sync();
})();