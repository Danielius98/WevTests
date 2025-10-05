'use client';

import type StudentInterface from '@/types/StudentInterface';
import styles from './Student.module.scss';

interface StudentProps {
  student: StudentInterface;
  onDelete: (id: number) => void;
}

const Student = ({ student, onDelete }: StudentProps): React.ReactElement => {
  const handleDelete = () => {
    onDelete(student.id);
  };

  return (
    <div className={styles.student}>
      <div className={styles.studentInfo}>
        <span className={styles.name}>
          {student.last_name} {student.first_name} {student.middle_name}
        </span>
        <span className={styles.groupId}>
          Группа: {student.groupId}
        </span>
      </div>
      <button 
        onClick={handleDelete} 
        className={styles.deleteButton}
        title="Удалить студента"
      >
        ×
      </button>
    </div>
  );
};

export default Student;
