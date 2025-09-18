const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'vki-web.db');
const db = new sqlite3.Database(dbPath);

const students = [
  { first_name: 'Иван', last_name: 'Иванов', middle_name: 'Иванович', groupId: 1 },
  { first_name: 'Петр', last_name: 'Петров', middle_name: 'Петрович', groupId: 1 },
  { first_name: 'Анна', last_name: 'Сидорова', middle_name: 'Сергеевна', groupId: 2 },
  { first_name: 'Мария', last_name: 'Козлова', middle_name: 'Александровна', groupId: 2 },
  { first_name: 'Алексей', last_name: 'Смирнов', middle_name: 'Дмитриевич', groupId: 1 },
  { first_name: 'Елена', last_name: 'Васильева', middle_name: 'Николаевна', groupId: 3 },
  { first_name: 'Дмитрий', last_name: 'Морозов', middle_name: 'Владимирович', groupId: 3 },
  { first_name: 'Ольга', last_name: 'Новикова', middle_name: 'Игоревна', groupId: 2 },
];

db.serialize(() => {
  // Создаем таблицу если её нет
  db.run(`CREATE TABLE IF NOT EXISTS student(  
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    groupId INTEGER
  )`);
  
  // Очищаем таблицу
  db.run('DELETE FROM student');
  
  // Добавляем тестовые данные
  const stmt = db.prepare('INSERT INTO student (first_name, last_name, middle_name, groupId) VALUES (?, ?, ?, ?)');
  
  students.forEach(student => {
    stmt.run(student.first_name, student.last_name, student.middle_name, student.groupId);
  });
  
  stmt.finalize();
  
  // Проверяем результат
  db.all('SELECT * FROM student', (err, rows) => {
    if (err) {
      console.error('Ошибка при получении данных:', err);
    } else {
      console.log('Добавлено студентов:', rows.length);
      console.log('Данные студентов:');
      rows.forEach(row => {
        console.log(`${row.id}. ${row.last_name} ${row.first_name} ${row.middle_name} (Группа: ${row.groupId})`);
      });
    }
    db.close();
  });
});
