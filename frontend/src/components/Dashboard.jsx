import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    myExpenses: 0,
    husbandExpenses: 0,
    sharedExpenses: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(response => response.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Загрузка данных... ⏳</div>;
  }

  return (
    <div className="dashboard">
        <h2>Дашборд</h2>
        <div className="metrics-grid">
        <div className="metric-card">
            <h3>Текущий баланс</h3>
            <div className="amount">₽{dashboardData.totalBalance.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
            <h3>Мои расходы</h3>
          <div className="amount">₽{dashboardData.myExpenses.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Расходы Максима</h3>
          <div className="amount">₽{dashboardData.husbandExpenses.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Семейные расходы</h3>
          <div className="amount">₽{dashboardData.sharedExpenses.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;