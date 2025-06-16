import Ulasan from '../models/UlasanModel.js';
import User from '../models/UserModel.js';
import Buku from '../models/BukuModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getUlasanById = async (req, res) => {
  try {
    const { id } = req.params;
    const ulasan = await Ulasan.findByPk(id);
    if (!ulasan) {
      return res.status(404).json({ message: 'Ulasan tidak ditemukan' });
    }
    res.status(200).json(ulasan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTabelUlasan = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel ulasan/ulasan.html'));
};

export const getFormUlasan = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/tabel ulasan/tambahUlasan.html'));
};
export const getFormEditUlasan = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/tabel ulasan/editUlasan.html'));
};

// Ambil semua ulasan (opsional, untuk admin)
export const getAllUlasan = async (req, res) => {
  try {
    const ulasan = await Ulasan.findAll({ include: [User, Buku] });
    res.status(200).json(ulasan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil semua ulasan untuk satu buku
export const getUlasanByBuku = async (req, res) => {
  try {
    const { buku_id } = req.params;
    const includeOptions = [
      {
        model: User,
        attributes: ['id', 'nama']
      }
    ];
    const ulasan = await Ulasan.findAll({
      where: { buku_id },
      include: includeOptions
    });
    res.status(200).json(ulasan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah ulasan (user login)
export const createUlasan = async (req, res) => {
  try {
    const users_id = req.cookies && req.cookies.isLoggedInId;
    const { buku_id, komentar, rating } = req.body;
    if (!users_id || !buku_id || !komentar || !rating) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const ulasan = await Ulasan.create({ users_id, buku_id, komentar, rating });
    res.status(201).json(ulasan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah ulasan dari admin (form)
export const createUlasanAdmin = async (req, res) => {
  try {
    const { users_id, buku_id, komentar, rating } = req.body;
    if (!users_id || !buku_id || !komentar || !rating) {
      return res.status(400).send('Data tidak lengkap');
    }
    await Ulasan.create({ users_id, buku_id, komentar, rating });
    res.redirect('/tabel-ulasan');
  } catch (error) {
    res.status(500).send('Gagal menambah ulasan: ' + error.message);
  }
};

// Hapus ulasan (hanya pemilik/admin)
export const deleteUlasan = async (req, res) => {
  try {
    const { id } = req.params;
    const users_id = req.cookies && req.cookies.isLoggedInId;
    const userRole = req.cookies && req.cookies.isLoggedInRole;
    const ulasan = await Ulasan.findByPk(id);
    if (!ulasan) return res.status(404).json({ message: 'Ulasan tidak ditemukan' });
    if (userRole !== 'admin' && ulasan.users_id !== users_id) {
      return res.status(403).json({ message: 'Tidak diizinkan menghapus ulasan ini' });
    }
    await ulasan.destroy();
    res.json({ message: 'Ulasan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ulasan (PUT)
export const updateUlasan = async (req, res) => {
  try {
    const { id } = req.params;
    const { users_id, buku_id, komentar, rating } = req.body;
    const ulasan = await Ulasan.findByPk(id);
    if (!ulasan) return res.status(404).json({ message: 'Ulasan tidak ditemukan' });
    ulasan.users_id = users_id;
    ulasan.buku_id = buku_id;
    ulasan.komentar = komentar;
    ulasan.rating = rating;
    await ulasan.save();
    res.json({ message: 'Ulasan berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
