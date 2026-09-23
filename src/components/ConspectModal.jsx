import React, { useState } from 'react';
import { X, Clock, Check, FileText, Award, Copy, Presentation, ExternalLink, GraduationCap } from 'lucide-react';

export default function ConspectModal({
  topic,
  isCompleted,
  isAssigned,
  onToggleCompleted,
  onToggleAssigned,
  onClose
}) {
  const [copied, setCopied] = useState(false);

  if (!topic || !topic.conspect) return null;

  const conspect = topic.conspect;

  const handleCopyConspect = () => {
    let fullText = `${topic.section} ${topic.title} (${topic.grade} класс, 20 мин)\n\n`;
    conspect.stages.forEach(stage => {
      fullText += `[${stage.label} ${stage.time ? `(${stage.time})` : ''}]\n${stage.content}\n\n`;
    });
    fullText += `Домашнее задание:\n${topic.homework}\n`;
    if (topic.answersAndCriteria) {
      fullText += `\nОтветы и критерии:\n${topic.answersAndCriteria}\n`;
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPresentation = () => {
    const url = topic.presentationUrl || `https://yandex.ru/search/?text=${encodeURIComponent(`Информатика ${topic.grade} класс ${topic.section} ${topic.title} презентация PDF`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1150px',
          width: '94vw',
          maxHeight: '92vh',
          borderRadius: '24px'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-card)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}>
                {topic.section}
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-stage)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <GraduationCap size={14} style={{ marginRight: '0.25rem' }} />
                {topic.grade} класс
              </span>
              <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                <Clock size={14} />
                20 минут урок
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: '1.3' }}>
              {topic.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-stage)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Закрыть окно"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Action Controls & Presentation Button Ribbon */}
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: 'var(--bg-stage)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Topic Passed Checkbox */}
            <label className={`custom-checkbox ${isCompleted ? 'checked-success' : ''}`}>
              <div className="checkbox-box" style={{ width: '22px', height: '22px' }}>
                {isCompleted && <Check size={16} strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggleCompleted(topic.id)}
                style={{ display: 'none' }}
              />
              <span style={{ color: isCompleted ? 'var(--accent-success)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                Тема пройдена
              </span>
            </label>

            {/* Homework Assigned Checkbox */}
            <label className={`custom-checkbox ${isAssigned ? 'checked-info' : ''}`}>
              <div className="checkbox-box" style={{ width: '22px', height: '22px' }}>
                {isAssigned && <Check size={16} strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                checked={isAssigned}
                onChange={() => onToggleAssigned(topic.id)}
                style={{ display: 'none' }}
              />
              <span style={{ color: isAssigned ? 'var(--accent-info)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                ДЗ задано
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Direct Link to Presentation PDF */}
            <button
              onClick={handleOpenPresentation}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.55rem 1rem', gap: '0.5rem', fontSize: '0.9rem' }}
              title="Открыть файл презентации (PDF)"
            >
              <Presentation size={18} />
              <span>Открыть презентацию (PDF)</span>
              <ExternalLink size={14} style={{ opacity: 0.8 }} />
            </button>

            {/* Copy Conspect Text Button */}
            <button
              onClick={handleCopyConspect}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.55rem 1rem', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              {copied ? (
                <>
                  <Check size={16} style={{ color: 'var(--accent-success)' }} />
                  <span>Текст скопирован!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Скопировать конспект</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Body with Larger Typography */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}>
          {/* Lesson Stages Section */}
          <div>
            <h3 style={{
              fontSize: '1.05rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-subtle)',
              marginBottom: '1.25rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
              План и хронометраж урока (20 минут)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {conspect.stages.map((stage, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.35rem 1.6rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', margin: 0 }}>
                      {stage.label}
                    </h4>
                    {stage.time && (
                      <span className="badge" style={{ backgroundColor: 'var(--bg-stage)', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}>
                        <Clock size={13} style={{ marginRight: '0.25rem' }} />
                        {stage.time}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.75',
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {stage.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Homework & Answers Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.25rem',
            marginTop: '0.5rem'
          }}>
            {/* Homework Box */}
            <div style={{
              backgroundColor: 'var(--bg-stage)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--accent-info)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                <FileText size={20} />
                <span>Домашнее задание</span>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.65', margin: 0 }}>
                {topic.homework}
              </p>
              {topic.extraHomework && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-warning)' }}>Дополнительное задание: </span>
                  <span style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>{topic.extraHomework}</span>
                </div>
              )}
            </div>

            {/* Answers & Criteria Box */}
            {topic.answersAndCriteria && (
              <div style={{
                backgroundColor: 'var(--bg-stage)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                  <Award size={20} />
                  <span>Ответы и критерии оценивания</span>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.65', margin: 0 }}>
                  {topic.answersAndCriteria}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
