import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handler untuk halaman utama user (homepage)
export const getHomepage = async (req, res) => {
    try {
        // Jika ingin data buku, bisa fetch dari frontend
        res.sendFile(path.join(__dirname, '../views/user/homepage.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
