import React, { useState } from 'react';
import { Check, BookOpen, ChevronDown, ChevronUp, FileText, Presentation, ExternalLink, GraduationCap } from 'lucide-react';

export default function TopicCard({
  topic,
  isCompleted,
  isAssigned,
  onToggleCompleted,
  onToggleAssigned,
  onOpenConspect
}) {
  const [showDetails, setShowDetails] = useState(false);

  const handleOpenPresentation = (e) => {
    e.stopPropagation();
    const url = topic.presentationUrl || `https://yandex.ru/search/?text=${encodeURIComponent(`Информатика ${topic.grade} класс ${topic.section} ${topic.title} презентация PDF`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`glass-card animate-fade-in ${isCompleted ? 'completed-card' : ''}`}
      style={{
        padding: '1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        position: 'relative',
        borderColor: isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
        backgroundColor: isCompleted ? 'var(--bg-card-hover)' : 'var(--bg-card)'
      }}
    >
      {/* Top badges & section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.825rem', padding: '0.25rem 0.65rem' }}>
            {topic.section}
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-stage)', color: 'var(--text-muted)' }}>
            <GraduationCap size={12} style={{ marginRight: '0.2rem' }} />
            {topic.grade} класс
          </span>
        </div>

        {/* Action Checkboxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Passed Checkbox */}
          <label
            className={`custom-checkbox ${isCompleted ? 'checked-success' : ''}`}
            title="Отметить тему как пройденную"
          >
            <div className="checkbox-box">
              {isCompleted && <Check size={14} strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onToggleCompleted(topic.id)}
              style={{ display: 'none' }}
            />
            <span style={{ color: isCompleted ? 'var(--accent-success)' : 'var(--text-muted)' }}>
              Пройдена
            </span>
          </label>

          {/* HW Assigned Checkbox */}
          <label
            className={`custom-checkbox ${isAssigned ? 'checked-info' : ''}`}
            title="Отметить домашку как заданную"
          >
            <div className="checkbox-box">
              {isAssigned && <Check size={14} strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={isAssigned}
              onChange={() => onToggleAssigned(topic.id)}
              style={{ display: 'none' }}
            />
            <span style={{ color: isAssigned ? 'var(--accent-info)' : 'var(--text-muted)' }}>
              ДЗ задано
            </span>
          </label>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        margin: 0,
        lineHeight: '1.35'
      }}>
        {topic.title}
      </h3>

      {/* Homework Summary Preview */}
      <div style={{
        backgroundColor: 'var(--bg-stage)',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={15} style={{ color: 'var(--accent-info)' }} />
          Домашнее задание:
        </div>
        <p style={{
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: showDetails ? 'none' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.5'
        }}>
          {topic.homework}
        </p>

        {topic.extraHomework && showDetails && (
          <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-color)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>Дополнительно: </span>
            {topic.extraHomework}
          </div>
        )}

        {topic.answersAndCriteria && showDetails && (
          <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-color)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>Ответы и критерии: </span>
            {topic.answersAndCriteria}
          </div>
        )}
      </div>

      {/* Footer Controls & Direct Presentation Link */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginTop: '0.35rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-subtle)',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {showDetails ? (
            <>Скрыть детали <ChevronUp size={14} /></>
          ) : (
            <>Подробнее о ДЗ <ChevronDown size={14} /></>
          )}
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Direct Presentation Link Button */}
          <button
            onClick={handleOpenPresentation}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
            title="Открыть файл презентации (PDF)"
          >
            <Presentation size={14} style={{ color: 'var(--accent-info)' }} />
            <span>Презентация PDF</span>
            <ExternalLink size={12} style={{ opacity: 0.7 }} />
          </button>

          {/* Conspect button */}
          {topic.conspect && (
            <button
              onClick={() => onOpenConspect(topic)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem', padding: '0.4rem 0.8rem' }}
            >
              <BookOpen size={14} />
              <span>Конспект</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
