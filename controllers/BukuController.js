import Buku from '../models/BukuModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tampilkan tabel buku (HTML)
export const tampilkanTabelBuku = async (req, res) => {
  try {
    // Data buku bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel buku/buku.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Endpoint API untuk data buku
export const getAllBuku = async (req, res) => {
  try {
    const daftarBuku = await Buku.findAll();
    res.json(daftarBuku);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tampilkan form upload buku
export const showUploadForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel buku/uploadBuku.html'));
};

// Tambah buku (POST)
export const uploadBuku = async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit, kategori, deskripsi, lokasi_rak } = req.body;
    let cover = null;
    if (req.file) {
      cover = req.file.buffer;
    }
    await Buku.create({
      judul,
      penulis,
      penerbit,
      tahun_terbit,
      kategori,
      deskripsi,
      lokasi_rak,
      cover
    });
    res.redirect('/tabel-buku');
  } catch (err) {
    res.status(500).send('Gagal upload buku: ' + err.message);
  }
};

// Tampilkan form edit buku
export const showEditForm = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    if (!buku) return res.redirect('/tabel-buku');
    // Data buku bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel buku/editBuku.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Update buku (POST)
export const updateBuku = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    if (!buku) return res.redirect('/tabel-buku');
    const { judul, penulis, penerbit, tahun_terbit, kategori, deskripsi, lokasi_rak } = req.body;
    buku.judul = judul;
    buku.penulis = penulis;
    buku.penerbit = penerbit;
    buku.tahun_terbit = tahun_terbit;
    buku.kategori = kategori;
    buku.deskripsi = deskripsi;
    buku.lokasi_rak = lokasi_rak;
    if (req.file && req.file.buffer) {
      buku.cover = req.file.buffer;
    }
    await buku.save();
    res.redirect('/tabel-buku');
  } catch (err) {
    res.status(500).send('Gagal update buku: ' + err.message);
  }
};

// Kirim gambar cover buku
export const getCover = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    if (!buku || !buku.cover) {
      return res.status(404).send('Cover tidak ditemukan');
    }
    res.set('Content-Type', 'image/jpeg'); // atau image/png jika cover-nya png
    res.send(buku.cover);
  } catch (err) {
    res.status(500).send('Gagal menampilkan cover: ' + err.message);
  }
};


// Hapus buku
export const deleteBuku = async (req, res) => {
  try {
    await Buku.destroy({ where: { id: req.params.id } });
    res.redirect('/tabel-buku');
  } catch (err) {
    res.status(500).send('Gagal hapus buku: ' + err.message);
  }
};

// Endpoint untuk ambil detail buku by id (JSON)
export const getBukuById = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    if (!buku) return res.status(404).json({ message: 'Buku tidak ditemukan' });
    res.json(buku);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDetailBuku = async (req, res) => {
    try {
        const buku = await Buku.findByPk(req.params.id);
        if (!buku) {
            return res.status(404).send('Buku tidak ditemukan');
        }
        res.sendFile(path.join(__dirname, '../views/user/detailBuku.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};