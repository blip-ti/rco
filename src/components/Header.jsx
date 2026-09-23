import React from 'react';
import { Search, BookOpen, Layers, LayoutGrid, List, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  theme,
  toggleTheme,
  totalTopicsCount
}) {
  const tabs = [
    { id: 'all', label: 'Все темы', count: totalTopicsCount },
    { id: '7', label: '7 класс', count: 29 },
    { id: '8', label: '8 класс', count: 20 },
    { id: '9', label: '9 класс', count: 20 },
    { id: 'overview', label: 'Оглавление & Инструкции' }
  ];

  return (
    <header className="glass-header">
      <div className="container" style={{ padding: '1rem 1.5rem' }}>
        {/* Top Navbar Row */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #818cf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Информатика. 7–9 классы
              </h1>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Интерактивный учебный портал • 69 тем, конспекты и ответы
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* View Mode Switcher */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-stage)',
              padding: '0.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Отображение карточками"
              >
                <LayoutGrid size={15} />
                <span style={{ display: 'none', smDisplay: 'inline' }}>Карточки</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Отображение таблицей"
              >
                <List size={15} />
                <span style={{ display: 'none', smDisplay: 'inline' }}>Таблица</span>
              </button>
            </div>

            {/* Theme Switcher Button */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Navigation & Search Row */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Tabs */}
          <nav style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-stage)',
                      color: isActive ? '#ffffff' : 'var(--text-subtle)'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '400px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }}
            />
            <input
              type="text"
              placeholder="Поиск темы, §, конспекта или ДЗ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 2.25rem 0.55rem 2.5rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
