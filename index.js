import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import db from './config/Database.js';
import * as authController from './controllers/AuthController.js';

const app = express();
const PORT = 3000;

// Untuk mendapatkan __dirname di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Cek koneksi database
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

// Route
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', authController.getLogin);
app.post('/login', authController.login);

app.get('/register', authController.getRegister);
app.post('/register', authController.register);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
