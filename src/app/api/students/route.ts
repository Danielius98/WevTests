import { NextResponse } from 'next/server';
import { getStudentsDb } from '@/db/studentDb';

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
