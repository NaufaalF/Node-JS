import Peminjaman from '../models/PeminjamanModel.js';
import User from '../models/UserModel.js';
import Buku from '../models/BukuModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ======================== API: GET Semua Peminjaman ========================
export const getAllPeminjaman = async (req, res) => {
  try {
    const userId = req.cookies?.isLoggedInId;
    const userRole = req.cookies?.isLoggedInRole;
    let peminjaman;

    const includeOptions = [
      {
        model: User,
        attributes: ['id', 'nama', 'email']
      },
      {
        model: Buku,
        attributes: ['id', 'judul', 'ketersediaan']
      }
    ];

    if (userRole === 'admin') {
      peminjaman = await Peminjaman.findAll({ include: includeOptions });
    } else {
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User belum login' });
      }
      peminjaman = await Peminjaman.findAll({
        include: includeOptions
      });
    }

    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================ USER AREA ============================

export const getAllPeminjamanUser = async (req, res) => {
  try {
    const userId = req.cookies?.isLoggedInId;
    const userRole = req.cookies?.isLoggedInRole;
    let peminjaman;

    const includeOptions = [
      {
        model: User,
        attributes: ['id', 'nama', 'email']
      },
      {
        model: Buku,
        attributes: ['id', 'judul', 'ketersediaan']
      }
    ];

    if (userRole === 'admin') {
      peminjaman = await Peminjaman.findAll({ include: includeOptions });
    } else {
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User belum login' });
      }
      peminjaman = await Peminjaman.findAll({
                where: { users_id: userId },

        include: includeOptions
      });
    }

    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tampilkan form tambah peminjaman
export const getFormPeminjaman = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/peminjaman.html'));
};

// Tambah data peminjaman (API untuk USER)
export const createPeminjaman = async (req, res) => {
  const userId = req.cookies?.isLoggedInId;
  const { buku_id, status_peminjaman } = req.body;

  if (!userId || !buku_id || !status_peminjaman) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    const buku = await Buku.findByPk(buku_id);
    if (!buku || buku.ketersediaan === 'dipinjam') {
      return res.status(400).json({ message: 'Buku sedang dipinjam atau tidak tersedia' });
    }

    const peminjaman = await Peminjaman.create({
      users_id: userId,
      buku_id,
      status_peminjaman
    });

    await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id } });
    res.status(201).json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================ ADMIN AREA ============================

// Tampilkan form tabel peminjaman
export const tampilkanTabelPeminjaman = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/peminjaman.html'));
};

// Tampilkan form tambah data peminjaman admin
export const showUploadForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/tambahPeminjaman.html'));
};

// Tampilkan form edit data peminjaman
export const showEditForm = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) return res.redirect('/tabel-peminjaman');

    // Data bisa di-fetch dari API
    res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/editPeminjaman.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Tambah data peminjaman dari admin
export const createPeminjamanAdmin = async (req, res) => {
  const { users_id, buku_id, status_peminjaman } = req.body;

  if (!users_id || !buku_id || !status_peminjaman) {
    return res.status(400).send('Data tidak lengkap');
  }

  try {
    const buku = await Buku.findByPk(buku_id);
    if (!buku || buku.ketersediaan === 'dipinjam') {
      return res.status(400).send('Buku tidak tersedia');
    }

    await Peminjaman.create({ users_id, buku_id, status_peminjaman });
    await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id } });
    res.redirect('/tabel-peminjaman');
  } catch (err) {
    res.status(500).send('Gagal menambah peminjaman: ' + err.message);
  }
};

// Update data peminjaman
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
    res.status(500).send('Gagal update peminjaman: ' + err.message);
  }
};

// Update status peminjaman (dipinjam / selesai)
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

    const idBuku = buku_id || peminjaman.buku_id;

    if (status_peminjaman === 'selesai') {
      await Buku.update({ ketersediaan: 'tersedia' }, { where: { id: idBuku } });
    } else if (status_peminjaman === 'dipinjam') {
      await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: idBuku } });
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
    if (!peminjaman) return res.redirect('/tabel-peminjaman');
    await peminjaman.destroy();
    res.redirect('/tabel-peminjaman');
  } catch (err) {
    res.status(500).send('Gagal menghapus data: ' + err.message);
  }
};
