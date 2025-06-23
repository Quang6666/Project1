const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres', // Thay bằng user của bạn
  password: '1', // Thay bằng password của bạn
  database: 'FrostShop', // Thay bằng tên database của bạn
  port: 5432, // Cổng mặc định của PostgreSQL
});

client.connect()
  .then(() => console.log('Kết nối thành công tới PostgreSQL!'))
  .catch(err => console.error('Lỗi kết nối:', err.stack));

module.exports = client;
