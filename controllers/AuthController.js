import path from 'path';
import User from '../models/UserModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tampilkan form register
export const getRegister = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
};

// Tampilkan form login
export const getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
};

// Proses register tanpa bcrypt
export const register = async (req, res) => {
  const { nama, email, password, role } = req.body;
  try {
    await User.create({
      nama,
      email,
      password, // password langsung disimpan (plain text)
      role
    });
    // Redirect ke halaman login setelah berhasil register
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal register: ' + err.message);
  }
};

// Proses login tanpa bcrypt
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send('User tidak ditemukan');
    }
    if (user.password !== password) {
      return res.send('Password salah');
    }
    // Set cookie login
    res.cookie('isLoggedIn', 'true');
    res.cookie('isLoggedInId', user.id);
    // Redirect sesuai role
    if (user.role === 'admin') {
      res.redirect('/dashboard');
    } else {
      res.redirect('/home');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal login: ' + err.message);
  }
};

// Logout user (hapus cookie, lalu redirect ke login)
export const logout = (req, res) => {
  res.clearCookie('isLoggedIn');
  res.redirect('/login');
};

// Middleware untuk cek login
export const requireLogin = (req, res, next) => {
  if (!req.cookies || req.cookies.isLoggedIn !== 'true') {
    return res.redirect('/login');
  }
  next();
};
