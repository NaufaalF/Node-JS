import User from '../models/UserModel.js';
import Buku from '../models/BukuModel.js';
import Peminjaman from '../models/PeminjamanModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tampilkan dashboard admin (HTML)
export const getDashboard = async (req, res) => {
  try {
    // Cek role dari cookie
    const userRole = req.cookies && req.cookies.isLoggedInId
      ? (await User.findByPk(req.cookies.isLoggedInId))?.role
      : null;
    if (userRole !== 'admin') {
      return res.redirect('/home');
    }
    res.sendFile(path.join(__dirname, '../views/admin/dashboard.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Endpoint API untuk data dashboard
export const getDashboardData = async (req, res) => {
  try {
    // Cek role dari cookie
    const userRole = req.cookies && req.cookies.isLoggedInId
      ? (await User.findByPk(req.cookies.isLoggedInId))?.role
      : null;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const totalPinjam = await Peminjaman.count();
    const totalUser = await User.count();
    const totalBuku = await Buku.count();
    res.json({ totalPinjam, totalUser, totalBuku });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
