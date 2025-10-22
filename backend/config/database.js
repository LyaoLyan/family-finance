const { Pool } = require('pg');


// Настройки подключения к БД
const pool = new Pool({
  user: 'postgres',           // твой пользователь БД
  host: 'localhost',          // где запущена БД
  database: 'postgres', // имя базы данных
  password: '123',    // пароль от PostgreSQL
  port: 5432,                 // стандартный порт PostgreSQL
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err);
  } else {
    console.log('✅ Успешно подключены к PostgreSQL');
    release();
  }
});

module.exports = pool;