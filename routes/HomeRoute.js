import express from 'express';
import { getHomepage } from '../controllers/HomeController.js';
import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();
router.get('/home', requireLogin, getHomepage);
// router.get('/user/buku/:id', getDetailBuku);
export default router;
