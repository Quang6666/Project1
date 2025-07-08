const client = require('../db');

// Render trang login
exports.loginPage = (req, res) => {
  res.render('login', { error: null });
};

// Xử lý đăng nhập từ form
exports.loginPagePost = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Lấy user và role
    const result = await client.query('SELECT u.*, ur.role_id, r.name as role_name FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.username = $1 AND u.password = $2', [username, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Lưu user vào session
      req.session.user = {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        role_name: user.role_name
      };
      if (user.role_id && user.role_id == 1) { // id=1 là admin
        res.redirect('/admin');
      } else {
        res.redirect('/index');
      }
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
    const result = await client.query('SELECT u.*, ur.role_id, r.name as role_name FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.username = $1 AND u.password = $2', [username, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.role_id && user.role_id == 1) { // id=1 là admin
        res.json({ success: true, message: 'Đăng nhập thành công!' });
      } else {
        res.json({ success: false, message: 'Tài khoản của bạn không có quyền truy cập trang admin!' });
      }
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

// Middleware kiểm tra đăng nhập và quyền admin
exports.requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role_id == 1) {
    return next();
  }
  return res.redirect('/login');
};

// Đăng xuất
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
