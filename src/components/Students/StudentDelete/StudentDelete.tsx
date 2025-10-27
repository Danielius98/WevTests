'use client';

import { useState } from 'react';
import Link from 'next/link';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Student.module.scss';

interface StudentProps {
  student: StudentInterface;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const Student = ({ student, onDelete, isDeleting = false }: StudentProps): React.ReactElement => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting student with ID:', student.id);
    onDelete(student.id);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`${styles.student} ${isDeleting ? styles.deleting : ''}`}>
      <div className={styles.studentInfo}>
        <Link href={`/students/${student.id}`} className={styles.nameLink}>
          <span className={styles.name}>
            {student.last_name} {student.first_name} {student.middle_name}
          </span>
        </Link>
        <span className={styles.groupId}>
          Группа: {student.group?.name || student.groupId}
        </span>
      </div>
      
      {showConfirm ? (
        <div className={styles.confirmButtons}>
          <button 
            onClick={handleConfirmDelete} 
            className={`${styles.confirmButton} ${styles.deleteConfirm}`}
            disabled={isDeleting}
            title="Подтвердить удаление"
          >
            ✓
          </button>
          <button 
            onClick={handleCancelDelete} 
            className={`${styles.confirmButton} ${styles.cancelButton}`}
            disabled={isDeleting}
            title="Отменить удаление"
          >
            ✗
          </button>
        </div>
      ) : (
        <button 
          onClick={handleDeleteClick} 
          className={styles.deleteButton}
          disabled={isDeleting}
          title="Удалить студента"
        >
          {isDeleting ? '...' : '×'}
        </button>
      )}
    </div>
  );
};

export default Student;
