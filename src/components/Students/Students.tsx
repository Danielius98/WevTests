'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import Student from './StudentDelete/StudentDelete';
import AddStudent from './AddStudent/AddStudent';
import styles from './Students.module.scss';

const Students = (): React.ReactElement => {
  const { students, isLoading, error, refetch, deleteStudent, addStudent, isDeletingStudent, isAddingStudent } = useStudents();

  if (isLoading) {
    return (
      <div className={styles.Students}>
        <div className={styles.loading}>Загрузка студентов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Students}>
        <div className={styles.error}>
          Ошибка загрузки: {error.message}
          <button onClick={() => refetch()} className={styles.retryButton}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className={styles.Students}>
      <div className={styles.header}>
        <h2 className={styles.title}>Список студентов</h2>
        <button onClick={() => refetch()} className={styles.refreshButton}>
          Обновить
        </button>
      </div>
      
      <AddStudent onAdd={addStudent} isAdding={isAddingStudent} />
      {students.length === 0 ? (
        <div className={styles.empty}>Студенты не найдены</div>
      ) : (
        <div className={styles.list}>
          {students.map((student: StudentInterface) => (
            <Student
              key={student.id}
              student={student}
              onDelete={deleteStudent}
              isDeleting={isDeletingStudent(student.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;

