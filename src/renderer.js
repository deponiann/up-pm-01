const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('budget.db');

function loadMembers() {
    db.all(`SELECT * FROM FamilyMembers`, (err, rows) => {
        const tbody = document.querySelector('#membersTable tbody');
        tbody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.full_name}</td>
                <td>${row.birth_date}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editMember(${row.member_id})">Редактировать</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMember(${row.member_id})">Удалить</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

document.getElementById('memberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const memberId = document.getElementById('memberId').value;
    const fullName = document.getElementById('fullName').value;
    const birthDate = document.getElementById('birthDate').value;

    if (memberId) {
        db.run(`UPDATE FamilyMembers SET full_name = ?, birth_date = ? WHERE member_id = ?`,
            [fullName, birthDate, memberId], () => {
                loadMembers();
                resetForm();
            });
    } else {
        db.run(`INSERT INTO FamilyMembers (full_name, birth_date) VALUES (?, ?)`,
            [fullName, birthDate], () => {
                loadMembers();
                resetForm();
            });
    }
});

function editMember(id) {
    db.get(`SELECT * FROM FamilyMembers WHERE member_id = ?`, [id], (err, row) => {
        document.getElementById('memberId').value = row.member_id;
        document.getElementById('fullName').value = row.full_name;
        document.getElementById('birthDate').value = row.birth_date;
        document.getElementById('cancelEdit').style.display = 'inline-block';
    });
}

function deleteMember(id) {
    if (confirm('Вы уверены, что хотите удалить этого члена семьи?')) {
        db.run(`DELETE FROM FamilyMembers WHERE member_id = ?`, [id], () => {
            loadMembers();
        });
    }
}

function resetForm() {
    document.getElementById('memberForm').reset();
    document.getElementById('memberId').value = '';
    document.getElementById('cancelEdit').style.display = 'none';
}

document.getElementById('cancelEdit').addEventListener('click', resetForm);

loadMembers();