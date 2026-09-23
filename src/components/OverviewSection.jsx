import React from 'react';
import { BookOpen, Info, Code, FileSpreadsheet, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

export default function OverviewSection({ overview }) {
  if (!overview) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner / Title Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-stage) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Методический комплект
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            {overview.title}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {overview.subtitle}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {overview.gradeSummaries.map((summary, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                  {summary.grade}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {summary.topicsCount} тем • {summary.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={20} style={{ color: 'var(--accent-primary)' }} />
          Методические инструкции для учителя
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {overview.guides.map((guide, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', margin: 0 }}>
                {guide.title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>
                {guide.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* References & Links */}
      {overview.references && overview.references.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} style={{ color: 'var(--accent-info)' }} />
            Нормативные источники и документация Python
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {overview.references.map((ref, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-stage)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {ref.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {ref.linkOrDesc}
                  </div>
                </div>
                <ExternalLink size={16} style={{ color: 'var(--accent-info)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
