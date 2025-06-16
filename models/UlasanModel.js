import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;
import User from "./UserModel.js";
import Buku from "./BukuModel.js";

const Ulasan = db.define('ulasan', {
    tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    komentar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    buku_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Buku,
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
});

// Relasi
Ulasan.belongsTo(User, { foreignKey: 'users_id' });
Ulasan.belongsTo(Buku, { foreignKey: 'buku_id' });

export default Ulasan;

(async () => {
    await db.sync();
})();