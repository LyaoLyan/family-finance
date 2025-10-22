import React, { useState, useEffect } from 'react';
import './TransactionsTable.css';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки транзакций
  const loadTransactions = () => {
    fetch('http://localhost:5000/api/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки:', error);
        setLoading(false);
      });
  };

  // Загружаем транзакции при монтировании компонента
  useEffect(() => {
    loadTransactions();
  }, []);


  const getOwner = (owner) => {
    switch(owner) {
      case 'me': return 'Лера';
      case 'husband': return 'Максим';
      case 'shared': return 'Общее';
      default: return '❓';
    }
  };

  // Функция для форматирования суммы
  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString();
    return amount < 0 ? `-₽${formatted}` : `+₽${formatted}`;
  };

  if (loading) {
    return <div className="loading">Загружаем транзакции...</div>;
  }

  return (
    <div className="transactions-table">
      <h2>📋 История операций</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Владелец</th>
              <th>Категория</th>
              <th>Описание</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{getOwner(transaction.owner)}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td className={transaction.amount < 0 ? 'expense' : 'income'}>
                  {formatAmount(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-info">
        Показано {transactions.length} операций
      </div>
    </div>
  );
};

export default TransactionsTable; 