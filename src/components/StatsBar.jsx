import React from 'react';
import { CheckCircle2, BookOpenCheck, BarChart3, RefreshCw, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatsBar({
  totalTopics,
  completedCount,
  assignedCount,
  gradeStats,
  onResetProgress
}) {
  const completedPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const assignedPercent = totalTopics > 0 ? Math.round((assignedCount / totalTopics) * 100) : 0;

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '1.35rem 1.6rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-badge)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Общий прогресс прохождения курса</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Информатика 7–9 классы • Всего тем: {totalTopics}
            </p>
          </div>
        </div>

        <button
          onClick={onResetProgress}
          className="btn btn-outline btn-sm"
          style={{ gap: '0.4rem', color: 'var(--text-subtle)' }}
          title="Сбросить все отметки"
        >
          <RefreshCw size={14} />
          <span>Сбросить прогресс</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Topic Completion Progress */}
        <div style={{
          backgroundColor: 'var(--bg-stage)',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
              Пройдено тем
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-success)' }}>
              {completedCount} из {totalTopics} ({completedPercent}%)
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${completedPercent}%`,
              backgroundColor: 'var(--accent-success)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>

        {/* Homework Assignment Progress */}
        <div style={{
          backgroundColor: 'var(--bg-stage)',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpenCheck size={16} style={{ color: 'var(--accent-info)' }} />
              Выдано ДЗ
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-info)' }}>
              {assignedCount} из {totalTopics} ({assignedPercent}%)
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${assignedPercent}%`,
              backgroundColor: 'var(--accent-info)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>
      </div>

      {/* Grade specific mini status */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
        {Object.entries(gradeStats).map(([gradeNum, stats]) => (
          <div
            key={gradeNum}
            style={{
              fontSize: '0.825rem',
              backgroundColor: 'var(--bg-main)',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <GraduationCap size={14} style={{ color: 'var(--accent-primary)' }} />
              {gradeNum} класс:
            </span>
            <span style={{ color: 'var(--accent-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCircle2 size={13} /> {stats.completed}/{stats.total} тем
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <span style={{ color: 'var(--accent-info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <BookOpenCheck size={13} /> {stats.assigned}/{stats.total} ДЗ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
