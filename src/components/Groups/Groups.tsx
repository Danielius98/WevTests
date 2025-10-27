'use client';

import useGroups from '@/hooks/useGroups';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Groups.module.scss';

const Groups = (): React.ReactElement => {
  const { groups } = useGroups();

  return (
    <div className={styles.Groups}>
      <div className={styles.header}>
        <h1 className={styles.title}>Список групп</h1>
      </div>
      
      {groups.length === 0 ? (
        <div className={styles.empty}>Группы не найдены</div>
      ) : (
        <div className={styles.list}>
          {groups.map((group: GroupInterface) => (
            <div key={group.id} className={styles.group}>
              <h2 className={styles.groupName}>{group.name}</h2>
              
              {group.students && group.students.length > 0 ? (
                <div className={styles.students}>
                  <h3 className={styles.studentsTitle}>Студенты группы ({group.students.length}):</h3>
                  <ul className={styles.studentsList}>
                    {group.students.map((student) => (
                      <li key={student.id} className={styles.student}>
                        {student.last_name} {student.first_name} {student.middle_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className={styles.noStudents}>Нет студентов в группе</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;
