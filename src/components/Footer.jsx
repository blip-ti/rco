import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

export default function Footer({ totalTopics, totalCompleted, totalAssigned }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      padding: '2rem 0',
      marginTop: '3rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Информатика 7–9 классы</span>
          <span>• Исходные данные: Информатика_7-9_классы.xlsx</span>
        </div>

        <div>
          Пройдено {totalCompleted} из {totalTopics} тем • Задано {totalAssigned} ДЗ
        </div>
      </div>
    </footer>
  );
}
