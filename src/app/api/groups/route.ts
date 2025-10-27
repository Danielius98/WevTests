import { GroupService } from '@/services/StudentService';
import { initializeDatabase } from '@/config/database';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    await initializeDatabase();
    const groupService = new GroupService();
    const groups = await groupService.getAllGroups();
    // Преобразуем TypeORM entities в plain objects для сериализации
    const plainGroups = JSON.parse(JSON.stringify(groups));
    return NextResponse.json(plainGroups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}
