import Dashboard from './components/Dashboard';
import TransactionsTable from './components/TransactionsTable';
import TransactionForm from './components/TransactionForm';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <TransactionsTable />
      <TransactionForm />
    </div>
  );
}

export default App;
