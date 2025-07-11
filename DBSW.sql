-- Bảng người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tạo tài khoản admin
INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@example.com');
-- Bảng vai trò
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
-- Thêm vai trò guest vào bảng roles
INSERT INTO roles (name, description) VALUES ('admin', 'Administrator with full access');
INSERT INTO roles (name, description) VALUES ('staff', 'Staff member with standard access');
INSERT INTO roles (name, description) VALUES ('guest', 'Guest user with limited access');
-- Bảng quyền
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Bảng liên kết người dùng - vai trò
CREATE TABLE user_roles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'admin';
-- Bảng liên kết vai trò - quyền
CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Bảng sản phẩm
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Bảng liên kết nhiều-nhiều sản phẩm - danh mục
CREATE TABLE product_categories (
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pending'
);

-- Bảng chi tiết đơn hàng (liên kết orders và products)
CREATE TABLE order_items (
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
select * from users;
select * from roles;
select * from permissions;
select * from user_roles;
select * from role_permissions;
select * from products;
select * from categories;
select * from product_categories;
select * from orders;
select * from order_items;
Drop table if exists users cascade;
Drop table if exists roles cascade;
Drop table if exists permissions cascade;
Drop table if exists user_roles cascade;
Drop table if exists role_permissions cascade;
Drop table if exists products cascade;
Drop table if exists categories cascade;
Drop table if exists product_categories cascade;
Drop table if exists orders cascade;
Drop table if exists order_items cascade;
