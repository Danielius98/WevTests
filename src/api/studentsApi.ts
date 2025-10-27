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
    console.log('>>> addStudentApi: Sending request for:', student);
    
    const response = await fetch(`${apiUrl}students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    console.log('>>> addStudentApi: Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Ошибка HTTP: ${response.status} ${response.statusText}`;
      console.error('>>> addStudentApi: Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const newStudent = await response.json() as StudentInterface;
    console.log('>>> addStudentApi: Received student from API:', newStudent);
    return newStudent;
  } catch (err) {
    console.error('>>> addStudentApi: Exception:', err);
    throw err;
  }
};

export const deleteStudentApi = async (id: number): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    console.log('>>> deleteStudentApi: Starting deletion for student ID:', id);
    console.log('>>> deleteStudentApi: URL:', `${apiUrl}students/${id}`);
    
    const response = await fetch(`${apiUrl}students/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('>>> deleteStudentApi: Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Ошибка HTTP: ${response.status} ${response.statusText}`;
      console.error('>>> deleteStudentApi: Error response:', errorData);
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('>>> deleteStudentApi: Success response:', result);
    return result.deletedStudentId !== undefined;
  } catch (err) {
    console.error('>>> deleteStudentApi: Exception:', err);
    throw err;
  }
};