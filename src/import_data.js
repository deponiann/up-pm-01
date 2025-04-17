const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('budget.db');

const familyMembers = [
    { full_name: 'Иванов Иван Петрович', birth_date: 31213 },
    { full_name: 'Иванова Мария Сергеевна', birth_date: 32040 },
    { full_name: 'Иванов Алексей Иванович', birth_date: 40214 },
    { full_name: 'Иванова Елена Викторовна', birth_date: 21619 },
    { full_name: 'Петров Сергей Александрович', birth_date: 30290 }
];

const jobs = [
    { full_name: 'Иванов Иван Петрович', position: 'Инженер', organization: 'ООО "ТехноСервис"', salary: 85000, start_date: 42064 },
    { full_name: 'Иванова Мария Сергеевна', position: 'Бухгалтер', organization: 'АО "ФинансГрупп"', salary: 75000, start_date: 41014 },
    { full_name: 'Иванова Елена Викторовна', position: 'Репетитор', organization: 'Частная практика', salary: 15000, start_date: 43840 },
    { full_name: 'Петров Сергей Александрович', position: 'Таксист', organization: 'Индивидуальная работа', salary: 30000, start_date: 44075 }
];

const products = [
    { name: 'Хлеб', category: 'Продукты', unit_price: 50 },
    { name: 'Молоко', category: 'Продукты', unit_price: 80 },
    { name: 'Бензин', category: 'Транспорт', unit_price: 80 },
    { name: 'Билет в кино', category: 'Развлечения', unit_price: 300 },
    { name: 'Зимнее пальто', category: 'Одежда', unit_price: 8500 },
    { name: 'Учебники', category: 'Образование', unit_price: 400 },
    { name: 'Лекарства', category: 'Здоровье', unit_price: 25000 },
    { name: 'Погашение кредита', category: 'Кредиты', unit_price: 89000 },
    { name: 'Смартфон в подарок', category: 'Подарки', unit_price: 99900 }
];

const expenses = [
    { purchase_date: 45689, full_name: 'Иванов Иван Петрович', product_name: 'Хлеб', quantity: 2 },
    { purchase_date: 45689, full_name: 'Иванов Иван Петрович', product_name: 'Молоко', quantity: 3 },
    { purchase_date: 45689, full_name: 'Иванов Иван Петрович', product_name: 'Молоко', quantity: 1 },
    { purchase_date: 45694, full_name: 'Иванова Мария Сергеевна', product_name: 'Зимнее пальто', quantity: 1 },
    { purchase_date: 45697, full_name: 'Петров Сергей Александрович', product_name: 'Бензин', quantity: 30 },
    { purchase_date: 45700, full_name: 'Иванова Елена Викторовна', product_name: 'Лекарства', quantity: 5 },
    { purchase_date: 45706, full_name: 'Иванов Иван Петрович', product_name: 'Погашение кредита', quantity: 1 },
    { purchase_date: 45710, full_name: 'Иванова Мария Сергеевна', product_name: 'Смартфон в подарок', quantity: 1 },
    { purchase_date: 45710, full_name: 'Иванов Алексей Иванович', product_name: 'Билет в кино', quantity: 1 }
];

// Импорт данных
db.serialize(() => {
    // Импорт FamilyMembers
    familyMembers.forEach(member => {
        db.run(`INSERT OR IGNORE INTO FamilyMembers (full_name, birth_date) VALUES (?, ?)`,
            [member.full_name, member.birth_date]);
    });

    // Импорт Products
    products.forEach(product => {
        db.run(`INSERT OR IGNORE INTO Products (name, category, unit_price) VALUES (?, ?, ?)`,
            [product.name, product.category, product.unit_price]);
    });

    // Импорт Jobs
    jobs.forEach(job => {
        db.get(`SELECT member_id FROM FamilyMembers WHERE full_name = ?`, [job.full_name], (err, row) => {
            if (row) {
                db.run(`INSERT INTO Jobs (member_id, position, organization, salary, start_date) VALUES (?, ?, ?, ?, ?)`,
                    [row.member_id, job.position, job.organization, job.salary, job.start_date]);
            }
        });
    });

    // Импорт Expenses
    expenses.forEach(expense => {
        db.get(`SELECT member_id FROM FamilyMembers WHERE full_name = ?`, [expense.full_name], (err, member) => {
            if (member) {
                db.get(`SELECT product_id FROM Products WHERE name = ?`, [expense.product_name], (err, product) => {
                    if (product) {
                        db.run(`INSERT INTO Expenses (member_id, product_id, purchase_date, quantity) VALUES (?, ?, ?, ?)`,
                            [member.member_id, product.product_id, expense.purchase_date, expense.quantity]);
                    }
                });
            }
        });
    });
});

db.close();