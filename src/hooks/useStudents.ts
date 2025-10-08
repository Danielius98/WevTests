import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addStudentApi, deleteStudentApi, getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  deleteStudent: (studentId: number) => void;
  addStudent: (student: Omit<StudentInterface, 'id'>) => void;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    // автоматически загружаем при монтировании
    enabled: true,
  });

  // Добавление студента
  const addStudentMutation = useMutation({
    mutationFn: async (student: Omit<StudentInterface, 'id'>) => addStudentApi(student),
    onMutate: async (newStudent: Omit<StudentInterface, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const optimisticId = Math.floor(Math.random() * -1000000);
      const optimisticStudent = { id: optimisticId, ...newStudent } as StudentInterface;
      queryClient.setQueryData<StudentInterface[]>(
        ['students'],
        [optimisticStudent, ...(previousStudents ?? [])]
      );
      return { previousStudents, optimisticId };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: (createdStudent, _variables, context) => {
      const prev = queryClient.getQueryData<StudentInterface[]>(['students']) ?? [];
      const replaced = prev.map(s => (s.id === context?.optimisticId ? createdStudent : s));
      queryClient.setQueryData<StudentInterface[]>(['students'], replaced);
    },
  });

  // Удаление студента
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const updatedStudents = (previousStudents ?? []).map((student: StudentInterface) => ({
        ...student,
        ...(student.id === studentId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
      return { previousStudents };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    onSuccess: (_success, studentId, context) => {
      const base = context?.previousStudents ?? [];
      const updated = base.filter((student: StudentInterface) => student.id !== studentId);
      queryClient.setQueryData<StudentInterface[]>(['students'], updated);
    },
  });

  return {
    students: data ?? [],
    isLoading,
    error: (error as Error) ?? null,
    refetch,
    deleteStudent: deleteStudentMutation.mutate,
    addStudent: addStudentMutation.mutate,
  };
};

export default useStudents;