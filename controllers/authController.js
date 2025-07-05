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
      res.redirect('/admin'); // chuyển sang dashboard admin
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

// Xử lý API đăng ký
exports.registerApi = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.json({ success: false, message: 'Thiếu thông tin!' });
  }
  try {
    // Kiểm tra username/email đã tồn tại
    const check = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (check.rows.length > 0) {
      return res.json({ success: false, message: 'Username hoặc email đã tồn tại!' });
    }
    // Thêm user mới
    const insertUser = await client.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [username, password, email]);
    const userId = insertUser.rows[0].id;
    // Gán vai trò guest cho user mới
    const guestRole = await client.query("SELECT id FROM roles WHERE name = 'guest'");
    if (guestRole.rows.length > 0) {
      await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, guestRole.rows[0].id]);
    }
    res.json({ success: true, message: 'Đăng ký thành công!' });
  } catch (err) {
    res.json({ success: false, message: 'Lỗi hệ thống!' });
  }
};
