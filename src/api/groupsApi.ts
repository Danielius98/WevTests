import type GroupInterface from '@/types/GroupInterface';

export const getGroupsApi = async (): Promise<GroupInterface[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}groups`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Ошибка HTTP: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    const groups = await response.json() as GroupInterface[];
    return groups;
  } catch (err) {
    console.error('>>> getGroupsApi', err);
    throw err; // Пробрасываем ошибку для обработки в TanStack Query
  }
};
