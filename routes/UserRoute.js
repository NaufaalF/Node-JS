import express from 'express';
import { createUser, getUserById, getUsers, getUserInfo } from '../controllers/UserController.js';

const router = express.Router();
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.get('/users-info', getUserInfo); // Assuming this is a route to get user info
export default router;