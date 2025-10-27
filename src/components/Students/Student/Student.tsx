'use client';

import type StudentInterface from '@/types/StudentInterface';
import BackLink from '@/components/layout/BackLink/BackLink';
import styles from './Student.module.scss';

interface StudentProps {
  student: StudentInterface;
}

const Student = ({ student }: StudentProps): React.ReactElement => {
  return (
    <div className={styles.student}>
      <BackLink href="/students" text="список студентов" />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Информация о студенте</h1>
      </div>
      
      <div className={styles.info}>
        <div className={styles.field}>
          <label className={styles.label}>Фамилия</label>
          <div className={styles.value}>{student.last_name}</div>
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Имя</label>
          <div className={styles.value}>{student.first_name}</div>
        </div>
        
        {student.middle_name && (
          <div className={styles.field}>
            <label className={styles.label}>Отчество</label>
            <div className={styles.value}>{student.middle_name}</div>
          </div>
        )}
        
        <div className={styles.field}>
          <label className={styles.label}>Группа</label>
          <div className={styles.value}>
            {student.group?.name || `ID: ${student.groupId}`}
          </div>
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>ID студента</label>
          <div className={styles.value}>{student.id}</div>
        </div>
      </div>
    </div>
  );
};

export default Student;

