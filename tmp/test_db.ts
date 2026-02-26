import mysql from 'mysql2/promise';

async function test() {
  console.log('Testing manual connection with root...');
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root_password',
      database: 'giftcode_db',
    });
    console.log('Connection successful!');
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

test();
