import mysql from 'mysql2/promise';

async function test() {
  console.log('Testing manual POOL connection with root...');
  try {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root_password',
      database: 'giftcode_db',
    });
    const [rows] = await pool.query('SELECT 1');
    console.log('Pool query successful:', rows);
    await pool.end();
  } catch (err) {
    console.error('Pool connection failed:', err);
  }
}

test();
