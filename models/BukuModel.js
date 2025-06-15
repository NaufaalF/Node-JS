import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Buku = db.define('buku', {
    judul: DataTypes.STRING,
    penulis: DataTypes.STRING,
    kategori: DataTypes.STRING,
    lokasi_rak: DataTypes.STRING,
    penerbit: DataTypes.STRING,
    ketersediaan: DataTypes.ENUM('tersedia', 'dipinjam'),
    tahun_terbit: DataTypes.INTEGER,
    cover: DataTypes.BLOB, // atau STRING jika URL
}, {
    freezeTableName: true,
});

export default Buku;

(async () => {
    await db.sync();
})();