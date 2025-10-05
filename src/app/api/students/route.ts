import { NextResponse } from 'next/server';
import { getStudentsDb, addStudentDb } from '@/db/studentDb';

export async function GET(): Promise<NextResponse> {
  try {
    const students = await getStudentsDb();
    return NextResponse.json(students);
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
    const body = await request.json();
    const { first_name, last_name, middle_name, groupId } = body;

    // Валидация обязательных полей
    if (!first_name || !last_name || !groupId) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, groupId' },
        { status: 400 }
      );
    }

    const newStudent = await addStudentDb({
      first_name,
      last_name,
      middle_name: middle_name || '',
      groupId: parseInt(groupId, 10)
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
