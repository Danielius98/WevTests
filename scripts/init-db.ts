import { AppDataSource } from '../src/config/database';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await AppDataSource.initialize();
    
    console.log('Database initialized successfully!');
    console.log('Available tables:');
    
    // Проверяем существующие таблицы
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log(tables);
    
    await queryRunner.release();
    await AppDataSource.destroy();
    
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

initializeDatabase();
