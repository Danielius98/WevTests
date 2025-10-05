import { deleteStudentDb } from '@/db/studentDb';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const studentId = parseInt(id, 10);
  const deletedStudentId = await deleteStudentDb(studentId);
  
  return new Response(JSON.stringify({ deletedStudentId }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
