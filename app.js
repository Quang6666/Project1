const express = require('express');
const bodyParser = require('body-parser');
const client = require('./db');
const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

app.get('/test', (req, res) => res.render('test', { error: null }));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}/login`);
});
