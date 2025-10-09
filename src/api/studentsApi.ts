import type StudentInterface from '@/types/StudentInterface';

export const getStudentsApi = async (): Promise<StudentInterface[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
    }
    
    const students = await response.json() as StudentInterface[];
    return students;
  } catch (err) {
    console.error('>>> getStudentsApi', err);
    throw err; // Пробрасываем ошибку для обработки в TanStack Query
  }
};

export const addStudentApi = async (student: Omit<StudentInterface, 'id'> & { uuid?: string }): Promise<StudentInterface> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
    }
    
    const newStudent = await response.json() as StudentInterface;
    return newStudent;
  } catch (err) {
    console.error('>>> addStudentApi', err);
    throw err;
  }
};

export const deleteStudentApi = async (id: number): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.deletedStudentId !== undefined;
  } catch (err) {
    console.error('>>> deleteStudentApi', err);
    throw err;
  }
};