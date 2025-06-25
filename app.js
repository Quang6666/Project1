const express = require('express');
const bodyParser = require('body-parser');
const client = require('./db');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRoutes);

app.get('/test', (req, res) => res.render('test', { error: null }));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}/login`);
});
