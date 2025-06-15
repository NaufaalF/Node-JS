import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Buku = db.define('buku', {
    judul: DataTypes.STRING,
    penulis: DataTypes.STRING,
    kategori: DataTypes.STRING,
    lokasi_rak: DataTypes.STRING,
    penerbit: DataTypes.STRING,
    ketersediaan: {
        type: DataTypes.ENUM('tersedia', 'dipinjam'),
        defaultValue: 'tersedia',
    },
    tahun_terbit: DataTypes.INTEGER,
    deskripsi: DataTypes.TEXT,
    cover: DataTypes.BLOB, // atau STRING jika URL
}, {
    freezeTableName: true,
});

export default Buku;

(async () => {
    await db.sync();
})();