import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import db from './config/Database.js';
import authRoute from './routes/AuthRoute.js';
import peminjamanRoute from './routes/PeminjamanRoute.js';
import dashboardRoute from './routes/DashboardRoute.js';
import homeRoute from './routes/HomeRoute.js';
import bukuRoute from './routes/BukuRoute.js';
import userRoute from './routes/UserRoute.js';

import './models/PeminjamanModel.js';

const app = express();
const PORT = 3000;

// Untuk mendapatkan __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cek koneksi database
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

// Route
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use(authRoute);

app.use(homeRoute);

app.use(peminjamanRoute);

app.use(dashboardRoute);

app.use(bukuRoute);

app.use(userRoute);


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
