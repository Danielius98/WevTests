'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useGroups from '@/hooks/useGroups';
import type StudentInterface from '@/types/StudentInterface';
import styles from './AddStudent.module.scss';

interface AddStudentProps {
  onAdd: (student: Omit<StudentInterface, 'id'> & { uuid?: string }) => void;
  isAdding?: boolean;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  groupId?: string;
}

const AddStudent = ({ onAdd, isAdding = false }: AddStudentProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    groupId: ''
  });

  // Используем хук для получения групп
  const { groups } = useGroups();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно для заполнения';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна для заполнения';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Фамилия должна содержать минимум 2 символа';
    }

    if (!formData.groupId) {
      newErrors.groupId = 'Выберите группу';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setErrors({});
      setSuccessMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку для поля при изменении
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const newStudent: Omit<StudentInterface, 'id'> & { uuid: string } = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        middle_name: formData.middle_name.trim(),
        groupId: parseInt(formData.groupId, 10),
        uuid: uuidv4()
      };
      
      // Вызываем mutation
      onAdd(newStudent);
      
      // Сброс формы
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        groupId: ''
      });
      
      // Показываем сообщение об успехе и закрываем форму
      setSuccessMessage('Студент успешно добавлен!');
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage('');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding student:', error);
      setErrors({ groupId: 'Ошибка при добавлении студента' });
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
    setErrors({});
    setSuccessMessage('');
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
            
            {successMessage && (
              <div className={styles.successMessage}>
                {successMessage}
              </div>
            )}
            
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
                className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
                placeholder="Введите фамилию"
                disabled={isLoading}
              />
              {errors.last_name && (
                <span className={styles.errorMessage}>{errors.last_name}</span>
              )}
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
                className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
                placeholder="Введите имя"
                disabled={isLoading}
              />
              {errors.first_name && (
                <span className={styles.errorMessage}>{errors.first_name}</span>
              )}
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
                placeholder="Введите отчество (необязательно)"
                disabled={isLoading}
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
                className={`${styles.select} ${errors.groupId ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                <option value="">
                  {groups.length === 0 ? 'Загрузка групп...' : 'Выберите группу'}
                </option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <span className={styles.errorMessage}>{errors.groupId}</span>
              )}
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
                disabled={isLoading || groups.length === 0}
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