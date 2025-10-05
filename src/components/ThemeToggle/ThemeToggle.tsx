'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.scss';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
      title={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
    >
      <div className={`${styles.icon} ${theme === 'dark' ? styles.dark : styles.light}`}>
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;
