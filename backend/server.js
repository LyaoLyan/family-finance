const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./config/database');

app.use(cors());
app.use(express.json());

// Тестовые данные
const dashboardData = {
  totalBalance: 45250,
  myExpenses: 80000, 
  husbandExpenses: 34000,
  sharedExpenses: 100000
};
const transactionsData = [
  {
    id: 1,
    date: "2023-12-15",
    owner: "me",
    category: "🛒 Продукты",
    description: "Супермаркет Ашан",
    amount: -2450
  },
  {
    id: 2, 
    date: "2023-12-14",
    owner: "husband",
    category: "🚗 Транспорт",
    description: "Заправка",
    amount: -1800
  },
  {
    id: 3,
    date: "2023-12-13", 
    owner: "shared",
    category: "🏠 Жилье",
    description: "Коммунальные услуги",
    amount: -8500
  },
  {
    id: 4,
    date: "2023-12-10",
    owner: "me", 
    category: "💄 Красота",
    description: "Салон",
    amount: -3200
  },
  {
    id: 5,
    date: "2023-12-08",
    owner: "shared",
    category: "💼 Доход", 
    description: "Зарплата",
    amount: 80000
  }
];
const errorResponse = {success: false, message:'ПАШЕЛ НАХУЙ'}
const successResponse = {success: true, message:'КРАСАВЧИК'}
app.get('/api/transactions', async (req, res) => {
  const data = await pool.query(`
    SELECT 
        t.id,
        t.date,
        t.owner,
        t.amount,
        t.description,
        c.name as category,
        c.icon
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
    `);
    const transactions = data.rows.map(row => ({
      id: row.id,
      date: row.date.toISOString().split('T')[0], 
      owner: row.owner,
      category: `${row.icon} ${row.category}`,
      description: row.description,
      amount: parseFloat(row.amount)
    }));
    res.json(transactions);
});

app.get('/api/dashboard', async (req, res) => {
  const [totalBalance, myExpenses, husbandExpenses, sharedExpenses] = await Promise.all([
      pool.query('SELECT SUM(amount) as total FROM transactions'),
      pool.query(`SELECT SUM(amount) as total FROM transactions WHERE owner = 'me'`),
      pool.query(`SELECT SUM(amount) as total FROM transactions WHERE owner = 'husband'`),
      pool.query(`SELECT SUM(amount) as total FROM transactions WHERE owner = 'shared'`)
    ]);
    
    const dashboard = {
      totalBalance: totalBalance.rows[0]?.total || 0,
      myExpenses: myExpenses.rows[0]?.total || 0,
      husbandExpenses: husbandExpenses.rows[0]?.total || 0,
      sharedExpenses: sharedExpenses.rows[0]?.total || 0
    };
    
    res.json(dashboard);
});
app.get('/api/categories', async (req, res) => {
const data = await pool.query(`
    SELECT 
        id,
        name,
        type,
        icon
      FROM categories
      ORDER BY name DESC
    `);
     const categories = data.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      icon: row.icon
    }));
    res.json(categories);
});
// API для добавления новой транзакции
app.post('/api/add-transaction', async(req, res) => {
  let owner = req.body.owner;
  if (!(owner=='me' || owner=='husband' || owner=='shared')) {
    return res.status(403).json(errorResponse)
  }
  await pool.query(
  "INSERT INTO transactions (date, owner, category_id, amount, description) VALUES ($1, $2, $3, $4, $5)",
  [req.body.date, req.body.owner, req.body.category_id, req.body.amount, req.body.description]
);
  res.json(successResponse);
});

// Тестовые маршрут
app.get('/api/test', (req, res) => {
    let test = req.query;
    res.json({test});
});
app.post('/api/test', (req, res) => {
    let test = req.body;
    res.json({test});
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🎯 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📊 API дашборда: http://localhost:${PORT}/api/dashboard`);
});