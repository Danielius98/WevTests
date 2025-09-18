import { useQuery } from '@tanstack/react-query';
import { getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useStudents = (): StudentsHookInterface => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });

  return {
    students: data ?? [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

export default useStudents;
