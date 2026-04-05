import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST!, // Dấu ! (non-null assertion) báo với TS rằng biến này chắc chắn có.
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DB!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;