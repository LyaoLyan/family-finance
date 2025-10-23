import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onTransactionAdded, categories: propCategories }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    owner: 'me',
    category_id: '',
    amount: '',
    description: ''
  });

  const [categories, setCategories] = useState(propCategories || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Загружаем категории если не переданы через props
  useEffect(() => {
    if (!propCategories || propCategories.length === 0) {
      loadCategories();
    } else {
      setCategories(propCategories);
    }
  }, [propCategories]);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error('Ошибка загрузки категорий');
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      setMessage('Ошибка загрузки категорий');
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
      // Находим выбранную категорию для определения типа (income/expense)
      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));
      
      const transactionData = {
        ...formData,
        amount: selectedCategory?.type === 'income' ? 
          Math.abs(parseFloat(formData.amount)) : 
          -Math.abs(parseFloat(formData.amount)),
        category_id: parseInt(formData.category_id)
      };

      const response = await fetch('http://localhost:5000/api/add-transaction', {
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

  // Поскольку API не возвращает owner_type, убираем фильтрацию по владельцу
  // и просто группируем категории по типу
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

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
              
              {incomeCategories.length > 0 && (
                <optgroup label="💰 Доходы">
                  {incomeCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {expenseCategories.length > 0 && (
                <optgroup label="💸 Расходы">
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </optgroup>
              )}
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