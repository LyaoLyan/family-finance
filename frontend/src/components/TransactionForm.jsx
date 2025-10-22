import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onTransactionAdded, categories }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // сегодняшняя дата
    owner: 'me',
    category_id: '',
    amount: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Загружаем категории если не переданы через props
  useEffect(() => {
    if (!categories || categories.length === 0) {
      loadCategories();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      // Если в будущем добавим API для категорий
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Преобразуем сумму в число
      const transactionData = {
        ...formData,
        amount: formData.owner === 'income' ? 
          Math.abs(parseFloat(formData.amount)) : 
          -Math.abs(parseFloat(formData.amount)),
        category_id: parseInt(formData.category_id)
      };

      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ Транзакция успешно добавлена!');
        
        // Сбрасываем форму
        setFormData({
          date: new Date().toISOString().split('T')[0],
          owner: 'me',
          category_id: '',
          amount: '',
          description: ''
        });

        // Уведомляем родительский компонент
        if (onTransactionAdded) {
          onTransactionAdded(result.transaction);
        }
      } else {
        throw new Error('Ошибка при добавлении транзакции');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('❌ Ошибка при добавлении транзакции');
    } finally {
      setLoading(false);
    }
  };

  // Фильтруем категории по типу владельца
  const filteredCategories = categories ? categories.filter(cat => 
    cat.owner_type === 'shared' || cat.owner_type === formData.owner
  ) : [];

  return (
    <div className="transaction-form">
      <h2>💸 Добавить операцию</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Дата:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Владелец:</label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              required
            >
              <option value="me">👤 Я</option>
              <option value="husband">👨 Муж</option>
              <option value="shared">🏠 Общие</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Категория:</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите категорию</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Сумма (₽):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Описание:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Например: Супермаркет Ашан"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? '⏳ Добавляем...' : '💾 Добавить операцию'}
        </button>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;