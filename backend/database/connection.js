require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o banco:', err.message);
    return;
  }
  console.log('🟢 Conexão com MySQL estabelecida!');
});

module.exports = connection;
