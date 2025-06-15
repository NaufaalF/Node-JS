import express from 'express';
import {getAllBuku, getDetailBuku, getBukuById} from '../controllers/BukuController.js';
import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();
router.get('/buku', requireLogin, getAllBuku);
router.get('/home/buku/:id', requireLogin, getDetailBuku);
router.get('/buku/:id', requireLogin, getBukuById);

export default router;



