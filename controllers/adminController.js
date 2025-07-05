const db = require('../db'); // hoặc require kết nối pool của bạn

// Trang tổng quan admin
exports.getDashboard = (req, res) => {
  res.render('admin');
};

// Lấy danh sách user và role
exports.getUserList = async (req, res) => {
  try {
    // Lấy user kèm role hiện tại
    const users = await db.query(`
      SELECT u.id, u.username, u.email, ur.role_id, r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.id
    `);
    // Lấy danh sách role
    const roles = await db.query('SELECT id, name FROM roles ORDER BY id');
    // Chọn view động: users.ejs hoặc admin.ejs
    const view = req.renderView || 'admin';
    res.render(view, {
      users: users.rows,
      roles: roles.rows
    });
  } catch (err) {
    res.status(500).send('Lỗi truy vấn dữ liệu');
  }
};

// Cập nhật vai trò user
exports.updateUserRole = async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    // Xóa role cũ
    await db.query('DELETE FROM user_roles WHERE user_id = $1', [user_id]);
    // Thêm role mới
    await db.query('INSERT INTO user_roles(user_id, role_id) VALUES ($1, $2)', [user_id, role_id]);
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Lỗi cập nhật vai trò');
  }
};
