import { notFound } from 'next/navigation';
import type StudentInterface from '@/types/StudentInterface';
import Student from '@/components/Students/Student/Student';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getStudent(id: string): Promise<StudentInterface | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export default async function StudentPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  return <Student student={student} />;
}


