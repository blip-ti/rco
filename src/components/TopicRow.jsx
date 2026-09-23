import React from 'react';
import { Check, BookOpen, Presentation } from 'lucide-react';

export default function TopicRow({
  topic,
  isCompleted,
  isAssigned,
  onToggleCompleted,
  onToggleAssigned,
  onOpenConspect
}) {
  const handleOpenPresentation = (e) => {
    e.stopPropagation();
    const searchUrl = `https://yandex.ru/search/?text=${encodeURIComponent(`Информатика ${topic.grade} класс ${topic.section} ${topic.title} презентация PDF`)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: isCompleted ? 'var(--bg-card-hover)' : 'transparent',
        transition: 'background-color 0.2s ease'
      }}
    >
      {/* Section */}
      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
        <span className="badge badge-primary">{topic.section}</span>
      </td>

      {/* Grade */}
      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
        <span className="badge" style={{ backgroundColor: 'var(--bg-stage)', color: 'var(--text-muted)' }}>
          {topic.grade} кл.
        </span>
      </td>

      {/* Title */}
      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-main)', minWidth: '220px' }}>
        {topic.title}
      </td>

      {/* Homework preview */}
      <td style={{ padding: '0.85rem 1rem', fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
        <div style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {topic.homework}
        </div>
      </td>

      {/* Checkboxes */}
      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <label className={`custom-checkbox ${isCompleted ? 'checked-success' : ''}`}>
            <div className="checkbox-box">
              {isCompleted && <Check size={14} strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onToggleCompleted(topic.id)}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '0.8rem' }}>Пройдена</span>
          </label>

          <label className={`custom-checkbox ${isAssigned ? 'checked-info' : ''}`}>
            <div className="checkbox-box">
              {isAssigned && <Check size={14} strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={isAssigned}
              onChange={() => onToggleAssigned(topic.id)}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '0.8rem' }}>ДЗ задано</span>
          </label>
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
          <button
            onClick={handleOpenPresentation}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
            title="Открыть презентацию"
          >
            <Presentation size={14} style={{ color: 'var(--accent-info)' }} />
            <span>Презентация</span>
          </button>

          {topic.conspect && (
            <button
              onClick={() => onOpenConspect(topic)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <BookOpen size={14} />
              <span>Конспект</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
