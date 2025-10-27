import { StudentService } from '@/services/StudentService';
import { initializeDatabase } from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log('>>> API GET: Initializing database...');
    await initializeDatabase();
    const { id } = await params;
    const studentId = parseInt(id, 10);
    console.log('>>> API GET: Getting student with ID:', studentId);
    
    const studentService = new StudentService();
    const student = await studentService.getStudentById(studentId);
    
    if (!student) {
      console.log('>>> API GET: Student not found');
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    console.log('>>> API GET: Successfully retrieved student:', studentId);
    // Преобразуем TypeORM entity в plain object для сериализации
    const plainStudent = JSON.parse(JSON.stringify(student));
    return NextResponse.json(plainStudent);
  } catch (error) {
    console.error('>>> API GET: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    console.log('>>> API DELETE: Initializing database...');
    await initializeDatabase();
    const { id } = await params;
    const studentId = parseInt(id, 10);
    console.log('>>> API DELETE: Deleting student with ID:', studentId);
    
    const studentService = new StudentService();
    const deleted = await studentService.deleteStudent(studentId);
    console.log('>>> API DELETE: Delete result:', deleted);
    
    if (!deleted) {
      console.log('>>> API DELETE: Student not found');
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    console.log('>>> API DELETE: Successfully deleted student:', studentId);
    return NextResponse.json({ deletedStudentId: studentId });
  } catch (error) {
    console.error('>>> API DELETE: Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
