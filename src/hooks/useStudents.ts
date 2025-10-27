import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { addStudentApi, deleteStudentApi, getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  deleteStudent: (studentId: number) => void;
  addStudent: (student: Omit<StudentInterface, 'id'> & { uuid?: string }) => void;
  isDeletingStudent: (studentId: number) => boolean;
  isAddingStudent: boolean;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => {
      console.log('>>> useQuery: Fetching students...');
      return getStudentsApi();
    },
    // автоматически загружаем при монтировании
    enabled: true,
    // Отключаем автоматический refetch после фокуса окна
    refetchOnWindowFocus: false,
    // Отключаем автоматический refetch при монтировании если данные есть
    refetchOnMount: false,
  });
  
  // Логируем изменения в data
  console.log('>>> useQuery: Data changed, students count:', data?.length ?? 0);

  // Добавление студента
  const addStudentMutation = useMutation({
    mutationFn: async (student: Omit<StudentInterface, 'id'> & { uuid?: string }) => addStudentApi(student),
    onMutate: async (newStudent: Omit<StudentInterface, 'id'> & { uuid?: string }) => {
      console.log('Adding student optimistically:', newStudent);
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const uuid = newStudent.uuid || uuidv4();
      const optimisticStudent = { id: -1, uuid, ...newStudent } as StudentInterface;
      console.log('Optimistic student:', optimisticStudent);
      queryClient.setQueryData<StudentInterface[]>(
        ['students'],
        [optimisticStudent, ...(previousStudents ?? [])]
      );
      return { previousStudents, uuid };
    },
    onError: (err, _variables, context) => {
      console.error('Error adding student:', err);
      if (context?.previousStudents) {
        queryClient.setQueryData<StudentInterface[]>(['students'], context.previousStudents);
      }
    },
    onSuccess: (createdStudent, _variables, context) => {
      console.log('Add student success:', createdStudent);
      console.log('Context:', context);
      console.log('Created student ID:', createdStudent?.id);
      console.log('Context UUID:', context?.uuid);
      
      // Убираем оптимистичный студент и заменяем на реального из API
      queryClient.setQueryData<StudentInterface[]>(['students'], (old) => {
        const previous = old ?? [];
        console.log('Before replacement - students count:', previous.length);
        console.log('Looking for UUID in students:', context?.uuid);
        
        const found = previous.find(s => s.uuid === context?.uuid);
        console.log('Found student with matching UUID:', found);
        
        if (!found) {
          console.error('ERROR: Student with UUID not found! Adding created student to the beginning.');
          return [createdStudent, ...previous];
        }
        
        const replaced = previous.map(s => {
          if (s.uuid === context?.uuid) {
            console.log('Replacing student:', s, 'with:', createdStudent);
            return createdStudent;
          }
          return s;
        });
        
        console.log('After replacement - students count:', replaced.length);
        return replaced;
      });
      
      // Инвалидируем кэш групп, чтобы обновить список студентов в группах
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  // Удаление студента
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: number) => {
      console.log('>> deleteStudentMutation: Starting deletion for:', studentId);
      const result = await deleteStudentApi(studentId);
      console.log('>> deleteStudentMutation: API result:', result);
      return result;
    },
    onMutate: async (studentId: number) => {
      console.log('>> deleteStudentMutation: onMutate - studentId:', studentId);
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      
      // Обновляем студента с флагом isDeleting для UI
      const updatedStudents = (previousStudents ?? []).map((student: StudentInterface) => 
        student.id === studentId ? { ...student, isDeleting: true } : student
      );
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
      
      return { previousStudents, studentId };
    },
    onError: (err, _variables, context) => {
      console.error('>> deleteStudentMutation: onError:', err);
      console.log('>> deleteStudentMutation: Context:', context);
      // Восстанавливаем предыдущее состояние в случае ошибки
      if (context?.previousStudents) {
        queryClient.setQueryData<StudentInterface[]>(['students'], context.previousStudents);
      }
    },
    onSuccess: (_success, studentId) => {
      console.log('>> deleteStudentMutation: onSuccess - studentId:', studentId);
      // Удаляем студента из кэша после успешного удаления
      queryClient.setQueryData<StudentInterface[]>(['students'], (old) => {
        const filtered = (old ?? []).filter((student: StudentInterface) => student.id !== studentId);
        console.log('>> deleteStudentMutation: onSuccess - before:', (old ?? []).length, 'after:', filtered.length);
        return filtered;
      });
      
      // Инвалидируем кэш групп, чтобы обновить список студентов в группах
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  // Проверка, удаляется ли конкретный студент
  const isDeletingStudent = (studentId: number): boolean => {
    const students = queryClient.getQueryData<StudentInterface[]>(['students']) ?? [];
    const student = students.find(s => s.id === studentId);
    return student?.isDeleting === true;
  };

  return {
    students: data ?? [],
    isLoading,
    error: (error as Error) ?? null,
    refetch,
    deleteStudent: deleteStudentMutation.mutate,
    addStudent: addStudentMutation.mutate,
    isDeletingStudent,
    isAddingStudent: addStudentMutation.isPending,
  };
};

export default useStudents;