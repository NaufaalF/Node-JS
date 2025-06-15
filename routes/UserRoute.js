import express from 'express';
import { createUser, getUserById, getUsers, tampilkanTabelUser, showUploadForm, tambahUser, showEditForm, updateUser, deleteUser } from '../controllers/UserController.js';
import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.get('/tabel-user', requireLogin, tampilkanTabelUser);
router.get('/tabel-user/tambah', requireLogin, showUploadForm)
router.post('/tabel-user/tambah',requireLogin, tambahUser); 
router.get('/tabel-user/edit/:id', requireLogin, showEditForm);
router.post('/tabel-user/edit/:id', requireLogin, updateUser);
router.post('/tabel-user/delete/:id', requireLogin, deleteUser);
export default router;