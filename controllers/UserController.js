import User from '../models/UserModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const tampilkanTabelUser = async (req, res) => {
  try {
    // Data user bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel user/user.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Tampilkan form upload user
export const showUploadForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel user/tambahUser.html'));
};

// Tambah user (POST)
export const tambahUser = async (req, res) => {
  try {
    const { nama, email, password, alamat, no_telp, role } = req.body;
    await User.create({
      nama,
      email,
      password,
      alamat,
      no_telp,
      role,
    });
    res.redirect('/tabel-user');
  } catch (err) {
    res.status(500).send('Gagal upload user: ' + err.message);
  }
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
export const updateUser = async (req, res) => {
  try {
    const users = await User.findByPk(req.params.id);
    if (!users) return res.redirect('/tabel-user');
    const { nama, email, alamat, no_telp } = req.body;
    users.nama = nama;
    users.email = email;
    users.alamat = alamat;
    users.no_telp = no_telp;
    await users.save();
    res.redirect('/tabel-user');
  } catch (err) {
    res.status(500).send('Gagal update user: ' + err.message);
  }
};

// Hapus user
export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.redirect('/tabel-user');
  } catch (err) {
    res.status(500).send('Gagal hapus user: ' + err.message);
  }
};

export const getUserInfo = async (req, res) => {
    try {
        const userId = req.cookies && req.cookies.isLoggedInId;
        if (!userId) return res.json({ username: null });
        const user = await User.findByPk(userId);
        res.json({ username: user ? user.nama : null });
    } catch (err) {
        res.json({ username: null });
    }
}

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createUser = async (req, res) => {
    try{
        await User.create(req.body);
        res.status(201).json({msg: "User Created"});
    } catch (error) {
        console.log(error.message);
    }
}