const client = require('../db');

// Trang quản lý sản phẩm & danh mục
exports.productAdminPage = async (req, res) => {
  try {
    const catRes = await client.query('SELECT * FROM categories ORDER BY id DESC');
    const prodRes = await client.query(`
      SELECT p.*, array_agg(c.name) as category_names
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
    res.render('productAdmin', {
      categories: catRes.rows,
      products: prodRes.rows
    });
  } catch (err) {
    res.status(500).send('Lỗi hệ thống');
  }
};

// Thêm danh mục
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    await client.query('INSERT INTO categories(name, description) VALUES($1, $2)', [name, description]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi thêm danh mục');
  }
};

// Trang sửa danh mục
exports.editCategoryPage = async (req, res) => {
  const id = req.params.id;
  try {
    const catRes = await client.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (!catRes.rows[0]) return res.status(404).send('Không tìm thấy danh mục');
    res.render('editCategory', { category: catRes.rows[0] });
  } catch (err) {
    res.status(500).send('Lỗi hệ thống');
  }
};

// Sửa danh mục
exports.editCategory = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    await client.query('UPDATE categories SET name=$1, description=$2 WHERE id=$3', [name, description, id]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi sửa danh mục');
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    await client.query('DELETE FROM categories WHERE id=$1', [id]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi xóa danh mục');
  }
};

// Trang thêm sản phẩm
exports.addProductPage = async (req, res) => {
  try {
    const catRes = await client.query('SELECT * FROM categories ORDER BY name');
    res.render('addProduct', { categories: catRes.rows });
  } catch (err) {
    res.status(500).send('Lỗi hệ thống');
  }
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { name, description, price, image_url, category_ids } = req.body;
  try {
    const prodRes = await client.query(
      'INSERT INTO products(name, description, price, image_url) VALUES($1, $2, $3, $4) RETURNING id',
      [name, description, price, image_url]
    );
    const productId = prodRes.rows[0].id;
    if (Array.isArray(category_ids)) {
      for (const catId of category_ids) {
        await client.query('INSERT INTO product_categories(product_id, category_id) VALUES($1, $2)', [productId, catId]);
      }
    } else if (category_ids) {
      await client.query('INSERT INTO product_categories(product_id, category_id) VALUES($1, $2)', [productId, category_ids]);
    }
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi thêm sản phẩm');
  }
};

// Trang sửa sản phẩm
exports.editProductPage = async (req, res) => {
  const id = req.params.id;
  try {
    const prodRes = await client.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!prodRes.rows[0]) return res.status(404).send('Không tìm thấy sản phẩm');
    const catRes = await client.query('SELECT * FROM categories ORDER BY name');
    const prodCatRes = await client.query('SELECT category_id FROM product_categories WHERE product_id=$1', [id]);
    const selectedCatIds = prodCatRes.rows.map(r => r.category_id);
    res.render('editProduct', {
      product: prodRes.rows[0],
      categories: catRes.rows,
      selectedCatIds
    });
  } catch (err) {
    res.status(500).send('Lỗi hệ thống');
  }
};

// Sửa sản phẩm
exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, price, image_url, category_ids } = req.body;
  try {
    await client.query('UPDATE products SET name=$1, description=$2, price=$3, image_url=$4 WHERE id=$5', [name, description, price, image_url, id]);
    await client.query('DELETE FROM product_categories WHERE product_id=$1', [id]);
    if (Array.isArray(category_ids)) {
      for (const catId of category_ids) {
        await client.query('INSERT INTO product_categories(product_id, category_id) VALUES($1, $2)', [id, catId]);
      }
    } else if (category_ids) {
      await client.query('INSERT INTO product_categories(product_id, category_id) VALUES($1, $2)', [id, category_ids]);
    }
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi sửa sản phẩm');
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await client.query('DELETE FROM products WHERE id=$1', [id]);
    res.redirect('/admin/products');
  } catch (err) {
    res.status(500).send('Lỗi khi xóa sản phẩm');
  }
};
