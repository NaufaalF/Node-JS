import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;
import User from "./UserModel.js";
import Buku from "./BukuModel.js";

const Peminjaman = db.define('peminjaman', {
    tanggal_kembali: DataTypes.DATE,
    tanggal_pinjam: DataTypes.DATE,
    anggota_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    buku_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Buku,
            key: 'id'
        }
    },
    status_peminjaman: DataTypes.ENUM('menunggu', 'dipinjam', 'selesai')
}, {
    freezeTableName: true,
});

// Relasi
Peminjaman.belongsTo(User, { foreignKey: 'anggota_id' });
Peminjaman.belongsTo(Buku, { foreignKey: 'buku_id' });

export default Peminjaman;

(async () => {
    await db.sync();
})();