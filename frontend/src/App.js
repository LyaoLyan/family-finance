import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TransactionsTable from './components/TransactionsTable';
import TransactionForm from './components/TransactionForm';
import './App.css'; 

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
    handleCloseModal();
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsTable />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="title-menu">
        <h1>Family Finance</h1>
        <div className="nav-list">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Дашборд
          </button>
          <button 
            className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Транзакции
          </button>
        </div>
        </div>
        <button 
          className="add-transaction-btn"
          onClick={handleOpenModal}
        >
          Добавить транзакцию
        </button>
      </header>
      
      <main className="main-content">
        {renderActiveComponent()}
      </main>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          <TransactionForm 
              onTransactionAdded={handleTransactionAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;