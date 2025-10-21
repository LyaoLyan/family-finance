const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Тестовые данные
const dashboardData = {
  totalBalance: 45250,
  myExpenses: 80000, 
  husbandExpenses: 34000,
  sharedExpenses: 100000
};

// API для дашборда
app.get('/api/dashboard', (req, res) => {
  console.log('✅ Кто-то запросил данные дашборда!');
  res.json(dashboardData);
});

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает! 🎉', status: 'OK' });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🎯 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📊 API дашборда: http://localhost:${PORT}/api/dashboard`);
});