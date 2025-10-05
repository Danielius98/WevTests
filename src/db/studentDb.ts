import sqlite3 from 'sqlite3';

import type StudentInterface from '@/types/StudentInterface';

sqlite3.verbose();

export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const students = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(rows);
      db.close();
    });
  });

  return students as StudentInterface[];
};

export const addStudentDb = async (student: Omit<StudentInterface, 'id'>): Promise<StudentInterface> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO student (first_name, last_name, middle_name, groupId) VALUES (?, ?, ?, ?)';
    db.run(sql, [student.first_name, student.last_name, student.middle_name, student.groupId], function(err) {
      if (err) {
        console.error('Error adding student:', err);
        reject(err);
        db.close();
        return;
      }
      
      // Возвращаем созданного студента с новым ID
      const newStudent: StudentInterface = {
        id: this.lastID,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        groupId: student.groupId
      };
      
      resolve(newStudent);
      db.close();
    });
  });
};

export const deleteStudentDb = async (id: number): Promise<boolean> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM student WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        console.error('Error deleting student:', err);
        reject(err);
        db.close();
        return;
      }
      
      // Проверяем, была ли удалена хотя бы одна запись
      const deleted = this.changes > 0;
      resolve(deleted);
      db.close();
    });
  });
};