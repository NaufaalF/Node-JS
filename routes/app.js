const express = require('express');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/register', authController.getRegister);
app.post('/register', authController.register);
app.get('/login', authController.getLogin);
app.post('/login', authController.login);

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));
