import Peminjaman from '../models/PeminjamanModel.js';
import User from '../models/UserModel.js';
import Buku from '../models/BukuModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tampilkan halaman daftar peminjaman hanya untuk user yang sedang login
export const getAllPeminjaman = async (req, res) => {
  try {
    const userId = req.cookies && req.cookies.isLoggedInId;
    const userRole = req.cookies && req.cookies.isLoggedInRole;
    let peminjaman;
    if (userRole === 'admin') {
      peminjaman = await Peminjaman.findAll({
        include: [User, Buku]
      });
    } else {
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User belum login' });
      }
      peminjaman = await Peminjaman.findAll({
        where: { users_id: userId },
        include: [User, Buku]
      });
    }
    res.json(peminjaman);
  } catch (err) {
    
    res.status(500).json({ message: err.message });
  }
};

// ============================== User ==============================

// Tampilkan form tambah peminjaman
export const getFormPeminjaman = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/peminjaman.html'));
};

// Tambah data peminjaman (API)
export const createPeminjaman = async (req, res) => {
  const { users_id, buku_id, status_peminjaman } = req.body;
  try {
    const peminjaman = await Peminjaman.create({
      users_id,
      buku_id,
      status_peminjaman
    });
    // Update status ketersediaan buku menjadi 'dipinjam'
    await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id } });
    res.status(201).json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah data peminjaman (ADMIN FORM)
export const createPeminjamanAdmin = async (req, res) => {
  const { users_id, buku_id, status_peminjaman } = req.body;
  try {
    await Peminjaman.create({
      users_id,
      buku_id,
      status_peminjaman
    });
    await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id } });
    res.redirect('/tabel-peminjaman');
  } catch (err) {
    res.status(500).send('Gagal menambah peminjaman: ' + err.message);
  }
};

// =============================== Admin ==============================

export const tampilkanTabelPeminjaman = async (req, res) => {
  try {
    // Data peminjaman bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/peminjaman.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

export const showUploadForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/tambahPeminjaman.html'));
};

export const showEditForm = async (req, res) => {
  try {
    const users = await User.findByPk(req.params.id);
    if (!users) return res.redirect('/tabel-user');
    // Data user bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel user/editUser.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Update user (POST)
export const updatePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) return res.redirect('/tabel-peminjaman');
    const { users_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman } = req.body;
    peminjaman.users_id = users_id;
    peminjaman.buku_id = buku_id;
    peminjaman.tanggal_pinjam = tanggal_pinjam;
    peminjaman.tanggal_kembali = tanggal_kembali;
    peminjaman.status_peminjaman = status_peminjaman;
    await peminjaman.save();
    res.redirect('/tabel-peminjaman');
  } catch (err) {
    res.status(500).send('Gagal update user: ' + err.message);
  }
};

// Update status peminjaman
export const updateStatusPeminjaman = async (req, res) => {
  const { id } = req.params;
  const { status_peminjaman, tanggal_pinjam, tanggal_kembali, buku_id } = req.body;
  try {
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) return res.status(404).json({ message: 'Data tidak ditemukan' });
    peminjaman.status_peminjaman = status_peminjaman;
    if (tanggal_pinjam) peminjaman.tanggal_pinjam = tanggal_pinjam;
    if (tanggal_kembali) peminjaman.tanggal_kembali = tanggal_kembali;
    await peminjaman.save();
    // Jika status selesai, update status buku menjadi tersedia
    if (status_peminjaman === 'selesai' && (buku_id || peminjaman.buku_id)) {
      await Buku.update({ ketersediaan: 'tersedia' }, { where: { id: buku_id || peminjaman.buku_id } });
    }
    // Jika status dipinjam, update status buku menjadi dipinjam
    if (status_peminjaman === 'dipinjam' && (buku_id || peminjaman.buku_id)) {
      await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id || peminjaman.buku_id } });
    }
    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus data peminjaman
export const deletePeminjaman = async (req, res) => {
  const { id } = req.params;
  try {
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) return res.status(404).json({ message: 'Data tidak ditemukan' });
    await peminjaman.destroy();
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
