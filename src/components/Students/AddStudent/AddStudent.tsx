'use client';

import { useState } from 'react';
import { getGroupsApi } from '@/api/groupsApi';
import type StudentInterface from '@/types/StudentInterface';
import type GroupInterface from '@/types/GroupInterface';
import styles from './AddStudent.module.scss';

interface AddStudentProps {
  onAdd: (student: Omit<StudentInterface, 'id'>) => void;
}

const AddStudent = ({ onAdd }: AddStudentProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    groupId: ''
  });

  const handleOpen = async () => {
    if (!isOpen) {
      try {
        const groupsData = await getGroupsApi();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.groupId) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsLoading(true);
    
    try {
      const newStudent: Omit<StudentInterface, 'id'> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        groupId: parseInt(formData.groupId, 10)
      };
      onAdd(newStudent);
      
      // Сброс формы
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        groupId: ''
      });
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Ошибка при добавлении студента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      middle_name: '',
      groupId: ''
    });
    setIsOpen(false);
  };

  return (
    <div className={styles.addStudent}>
      <button 
        onClick={handleOpen}
        className={styles.addButton}
        disabled={isLoading}
      >
        {isOpen ? 'Отмена' : '+ Добавить студента'}
      </button>

      {isOpen && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>Добавить нового студента</h3>
            
            <div className={styles.field}>
              <label htmlFor="last_name" className={styles.label}>
                Фамилия *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="first_name" className={styles.label}>
                Имя *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="middle_name" className={styles.label}>
                Отчество
              </label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="groupId" className={styles.label}>
                Группа *
              </label>
              <select
                id="groupId"
                name="groupId"
                value={formData.groupId}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Выберите группу</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddStudent;
