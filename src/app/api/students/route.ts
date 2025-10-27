import { NextResponse } from 'next/server';
import { StudentService } from '@/services/StudentService';
import { initializeDatabase } from '@/config/database';

export async function GET(): Promise<NextResponse> {
  try {
    await initializeDatabase();
    const studentService = new StudentService();
    const students = await studentService.getAllStudents();
    // Преобразуем TypeORM entities в plain objects для сериализации
    const plainStudents = JSON.parse(JSON.stringify(students));
    return NextResponse.json(plainStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { first_name, last_name, middle_name, groupId } = body;

    // Валидация обязательных полей
    if (!first_name || !last_name || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, groupId' },
        { status: 400 }
      );
    }

    const studentService = new StudentService();
    const newStudent = await studentService.createStudent({
      first_name,
      last_name,
      middle_name: middle_name || '',
      groupId: parseInt(groupId, 10)
    });

    // Преобразуем TypeORM entity в plain object для сериализации
    const plainStudent = JSON.parse(JSON.stringify(newStudent));
    return NextResponse.json(plainStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
