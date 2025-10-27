import { DataSource } from 'typeorm';
import { Student } from '../entities/Student';
import { Group } from '../entities/Group';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB ?? './db/vki-web.db',
  entities: [Student, Group],
  synchronize: true, // В продакшене должно быть false
  logging: process.env.NODE_ENV === 'development',
});

// Инициализация подключения к базе данных
let initializationPromise: Promise<void> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Если уже инициализирован, ничего не делаем
    if (AppDataSource.isInitialized) {
      return;
    }
    
    // Если инициализация уже идет, ждем её
    if (initializationPromise) {
      return initializationPromise;
    }
    
    // Создаем новое обещание инициализации
    initializationPromise = (async () => {
      await AppDataSource.initialize();
      console.log('Database connection initialized successfully');
      initializationPromise = null; // Сбрасываем после успешной инициализации
    })();
    
    await initializationPromise;
  } catch (error) {
    console.error('Error during database initialization:', error);
    initializationPromise = null; // Сбрасываем в случае ошибки
    throw error;
  }
};
