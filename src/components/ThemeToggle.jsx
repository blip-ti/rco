import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline"
      style={{
        padding: '0.5rem 0.9rem',
        borderRadius: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.85rem'
      }}
      title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      aria-label="Смена темы оформления"
    >
      {isDark ? (
        <>
          <Sun size={18} style={{ color: '#f59e0b' }} />
          <span style={{ fontWeight: 600 }}>Светлая тема</span>
        </>
      ) : (
        <>
          <Moon size={18} style={{ color: '#6366f1' }} />
          <span style={{ fontWeight: 600 }}>Тёмная тема</span>
        </>
      )}
    </button>
  );
}
