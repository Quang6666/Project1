const client = require('../db');

// Render trang login
exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

// Xử lý đăng nhập từ form
exports.loginPagePost = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.send('Đăng nhập thành công!');
    } else {
      res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
    }
  } catch (err) {
    res.render('login', { error: 'Lỗi hệ thống!' });
  }
};

// Xử lý API login
exports.loginApi = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
      res.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
    }
  } catch (err) {
    res.json({ success: false, message: 'Lỗi hệ thống!' });
  }
};
