import 'reflect-metadata';
import { dehydrate } from '@tanstack/react-query';

import TanStackQuery from '@/containers/TanStackQuery';
import { ThemeProvider } from '@/contexts/ThemeContext';
import queryClient from '@/api/reactQueryClient';
import { StudentService, GroupService } from '@/services/StudentService';
import { initializeDatabase } from '@/config/database';
import type GroupInterface from '@/types/GroupInterface';
import type StudentInterface from '@/types/StudentInterface';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Main from '@/components/layout/Main/Main';

import type { Metadata } from 'next';

import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Вэб разработка ВКИ - Next.js шаблон',
  description: 'Шаблон для веб-разработки с использованием Next.js, React Hook Form, Yup, SCSS, Eslint, TanStack Query (React Query)',
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> => {
  let groups: GroupInterface[];
  let students: StudentInterface[];

  await initializeDatabase();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['groups'],
      queryFn: async () => {
        const groupService = new GroupService();
        const groupEntities = await groupService.getAllGroups();
        // Преобразуем entity-объекты в plain objects для передачи в Client Components
        groups = JSON.parse(JSON.stringify(groupEntities)) as GroupInterface[];
        console.log('Groups', groups);
        return groups;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['students'],
      queryFn: async () => {
        const studentService = new StudentService();
        const studentEntities = await studentService.getAllStudents();
        // Преобразуем entity-объекты в plain objects для передачи в Client Components
        students = JSON.parse(JSON.stringify(studentEntities)) as StudentInterface[];
        console.log('Students', students);
        return students;
      },
    }),
  ]);

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <TanStackQuery state={state}>
      <ThemeProvider>
        <html lang="ru">
          <body>
            <Header />
            <Main>
              <>{children}</>
            </Main>
            <Footer />
          </body>
        </html>
      </ThemeProvider>
    </TanStackQuery>
  );
};

export default RootLayout;
