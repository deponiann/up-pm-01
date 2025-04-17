const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('budget.db');

const sql = fs.readFileSync('src/create_database.sql', 'utf8');
db.exec(sql, (err) => {
    if (err) {
        console.error('Ошибка при создании базы данных:', err);
    } else {
        console.log('База данных успешно создана');
    }
    db.close();
});