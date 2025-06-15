import express from 'express';
import { getLogin, getRegister, register, login, logout} from '../controllers/AuthController.js';

const router = express.Router();
router.get('/register', getRegister);
router.post('/register', register);
router.get('/login', getLogin);
router.post('/login', login);
router.get('/logout', logout);

export default router;



