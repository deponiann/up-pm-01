-- Создание таблицы FamilyMembers
CREATE TABLE FamilyMembers (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL UNIQUE,
    birth_date INTEGER
);

-- Создание таблицы Jobs
CREATE TABLE Jobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    position TEXT,
    organization TEXT,
    salary REAL,
    start_date INTEGER,
    FOREIGN KEY (member_id) REFERENCES FamilyMembers(member_id) ON DELETE CASCADE
);

-- Создание таблицы Products
CREATE TABLE Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    unit_price REAL
);

-- Создание таблицы Expenses
CREATE TABLE Expenses (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    product_id INTEGER,
    purchase_date INTEGER,
    quantity INTEGER,
    FOREIGN KEY (member_id) REFERENCES FamilyMembers(member_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);