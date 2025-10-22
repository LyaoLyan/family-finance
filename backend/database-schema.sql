-- 1. Таблица categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    owner_type VARCHAR(10) NOT NULL CHECK (owner_type IN ('personal', 'shared')),
    icon VARCHAR(10),
    color VARCHAR(7) DEFAULT '#3498db',
    budget_limit DECIMAL(10,2) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_budget_limit CHECK (budget_limit IS NULL OR budget_limit > 0)
);

-- 2. Таблица transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    owner VARCHAR(10) NOT NULL CHECK (owner IN ('me', 'husband', 'shared')),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount != 0),
    description TEXT,
    receipt_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_type VARCHAR(20) DEFAULT NULL CHECK (recurring_type IN ('weekly', 'monthly', 'yearly')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_owner ON transactions(owner);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_amount ON transactions(amount);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_owner_type ON categories(owner_type);

-- Вставляем категории
INSERT INTO categories (name, type, owner_type, icon, color, budget_limit) VALUES
-- Income categories
('💼 Зарплата', 'income', 'shared', '💼', '#27ae60', NULL),
('🏠 Аренда', 'income', 'shared', '🏠', '#2ecc71', NULL),
('📈 Инвестиции', 'income', 'shared', '📈', '#1abc9c', NULL),
('🎁 Подарки', 'income', 'personal', '🎁', '#16a085', NULL),
-- Shared expense categories
('🛒 Продукты', 'expense', 'shared', '🛒', '#e74c3c', 15000),
('🚗 Транспорт', 'expense', 'shared', '🚗', '#c0392b', 8000),
('🏠 Жилье', 'expense', 'shared', '🏠', '#d35400', 20000),
('🎬 Развлечения', 'expense', 'shared', '🎬', '#e67e22', 7000),
('🏥 Здоровье', 'expense', 'shared', '🏥', '#f39c12', 5000),
('📱 Связь', 'expense', 'shared', '📱', '#f1c40f', 2000),
('👗 Одежда', 'expense', 'shared', '👗', '#e74c3c', 6000),
-- Personal expense categories (for 'me')
('💄 Красота', 'expense', 'personal', '💄', '#9b59b6', 5000),
('📚 Образование', 'expense', 'personal', '📚', '#8e44ad', 8000),
('☕ Кофе/Перекусы', 'expense', 'personal', '☕', '#3498db', 3000),
-- Personal expense categories (for 'husband')
('🎯 Хобби', 'expense', 'personal', '🎯', '#34495e', 4000),
('🏋️ Спорт', 'expense', 'personal', '🏋️', '#2c3e50', 3000),
('📱 Техника', 'expense', 'personal', '📱', '#7f8c8d', 10000);

-- Вставляем тестовые транзакции
INSERT INTO transactions (date, owner, category_id, amount, description) VALUES
-- Income transactions
('2023-12-08', 'shared', 1, 80000, 'Зарплата за ноябрь'),
('2023-12-05', 'shared', 2, 25000, 'Сдача квартиры в аренду'),
-- Shared expenses
('2023-12-15', 'me', 5, -2450, 'Супермаркет Ашан'),
('2023-12-14', 'husband', 6, -1800, 'Заправка автомобиля'),
('2023-12-13', 'shared', 7, -8500, 'Коммунальные услуги'),
('2023-12-12', 'shared', 8, -2500, 'Поход в кино'),
('2023-12-10', 'shared', 9, -1200, 'Визит к врачу'),
-- Personal expenses (me)
('2023-12-10', 'me', 12, -3200, 'Салон красоты'),
('2023-12-08', 'me', 13, -1500, 'Онлайн-курсы'),
('2023-12-05', 'me', 14, -350, 'Кофе с подругой'),
-- Personal expenses (husband)
('2023-12-11', 'husband', 15, -2200, 'Новые рыболовные снасти'),
('2023-12-09', 'husband', 16, -1800, 'Абонемент в спортзал'),
('2023-12-07', 'husband', 17, -7500, 'Новые наушники');

-- View для дашборда
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM transactions t JOIN categories c ON t.category_id = c.id WHERE c.type = 'income') as total_income,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions t JOIN categories c ON t.category_id = c.id WHERE c.type = 'expense') as total_expenses,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE owner = 'me' AND amount < 0) as my_expenses,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE owner = 'husband' AND amount < 0) as husband_expenses;