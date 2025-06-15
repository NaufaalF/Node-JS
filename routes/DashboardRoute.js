import express from 'express';
import { getDashboard, getDashboardData } from '../controllers/DashboardController.js';

import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();
router.get('/dashboard', requireLogin, getDashboard);
router.get('/dashboard/api', requireLogin, getDashboardData);
export default router;