import React, { useState, useEffect, useMemo } from 'react';
import curriculumData from './data/curriculum.json';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TopicCard from './components/TopicCard';
import TopicRow from './components/TopicRow';
import ConspectModal from './components/ConspectModal';
import OverviewSection from './components/OverviewSection';
import Footer from './components/Footer';
import { Filter, CheckCircle2, BookOpenCheck, ListFilter, Circle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // 1. Theme State (Default: dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('informatics_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('informatics_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. State for Completed Topics & Assigned Homework (LocalStorage)
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('informatics_completed_topics');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [assignedHw, setAssignedHw] = useState(() => {
    try {
      const saved = localStorage.getItem('informatics_assigned_hw');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('informatics_completed_topics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem('informatics_assigned_hw', JSON.stringify(assignedHw));
  }, [assignedHw]);

  // 3. Navigation & Filtering State
  const [activeTab, setActiveTab] = useState('all'); // 'all', '7', '8', '9', 'overview'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'uncompleted', 'assigned', 'unassigned'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'table'
  const [selectedConspectTopic, setSelectedConspectTopic] = useState(null);

  // Flatten all topics across 7, 8, 9 grades
  const allTopics = useMemo(() => {
    const list = [];
    ['7', '8', '9'].forEach(gradeKey => {
      if (curriculumData.grades[gradeKey]) {
        list.push(...curriculumData.grades[gradeKey]);
      }
    });
    return list;
  }, []);

  // Handlers for checkboxes
  const toggleCompleted = (id) => {
    setCompletedTopics(prev => {
      const nextState = { ...prev, [id]: !prev[id] };
      if (nextState[id]) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      return nextState;
    });
  };

  const toggleAssigned = (id) => {
    setAssignedHw(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Вы действительно хотите сбросить все отметки пройденных тем и заданных ДЗ?')) {
      setCompletedTopics({});
      setAssignedHw({});
    }
  };

  // Calculate statistics
  const totalTopicsCount = allTopics.length;
  const completedCount = useMemo(() => {
    return allTopics.filter(t => completedTopics[t.id]).length;
  }, [allTopics, completedTopics]);

  const assignedCount = useMemo(() => {
    return allTopics.filter(t => assignedHw[t.id]).length;
  }, [allTopics, assignedHw]);

  const gradeStats = useMemo(() => {
    const res = {};
    ['7', '8', '9'].forEach(g => {
      const list = curriculumData.grades[g] || [];
      const comp = list.filter(t => completedTopics[t.id]).length;
      const ass = list.filter(t => assignedHw[t.id]).length;
      res[g] = { total: list.length, completed: comp, assigned: ass };
    });
    return res;
  }, [completedTopics, assignedHw]);

  // Filtering topics logic
  const filteredTopics = useMemo(() => {
    return allTopics.filter(topic => {
      // 1. Grade Tab Filter
      if (activeTab !== 'all' && activeTab !== 'overview') {
        if (String(topic.grade) !== activeTab) return false;
      }

      // 2. Status Filter
      if (statusFilter === 'completed' && !completedTopics[topic.id]) return false;
      if (statusFilter === 'uncompleted' && completedTopics[topic.id]) return false;
      if (statusFilter === 'assigned' && !assignedHw[topic.id]) return false;
      if (statusFilter === 'unassigned' && assignedHw[topic.id]) return false;

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inSec = topic.section.toLowerCase().includes(q);
        const inTitle = topic.title.toLowerCase().includes(q);
        const inHw = topic.homework ? topic.homework.toLowerCase().includes(q) : false;
        const inAnswers = topic.answersAndCriteria ? topic.answersAndCriteria.toLowerCase().includes(q) : false;
        
        let inConspect = false;
        if (topic.conspect && topic.conspect.stages) {
          inConspect = topic.conspect.stages.some(st => 
            st.label.toLowerCase().includes(q) || st.content.toLowerCase().includes(q)
          );
        }

        return inSec || inTitle || inHw || inAnswers || inConspect;
      }

      return true;
    });
  }, [allTopics, activeTab, statusFilter, searchQuery, completedTopics, assignedHw]);

  const filterButtons = [
    { id: 'all', label: 'Все темы', icon: null },
    { id: 'completed', label: 'Пройденные', icon: <CheckCircle2 size={14} style={{ color: 'var(--accent-success)' }} /> },
    { id: 'uncompleted', label: 'Не пройденные', icon: <Circle size={14} style={{ color: 'var(--text-subtle)' }} /> },
    { id: 'assigned', label: 'ДЗ задано', icon: <BookOpenCheck size={14} style={{ color: 'var(--accent-info)' }} /> },
    { id: 'unassigned', label: 'ДЗ не задано', icon: <Clock size={14} style={{ color: 'var(--accent-warning)' }} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        toggleTheme={toggleTheme}
        totalTopicsCount={totalTopicsCount}
      />

      {/* Main Content Area */}
      <main className="container" style={{ paddingTop: '2rem', flex: 1 }}>
        {/* Render Overview Section when overview tab is selected */}
        {activeTab === 'overview' ? (
          <OverviewSection overview={curriculumData.overview} />
        ) : (
          <>
            {/* Overall Progress Stats Bar */}
            <StatsBar
              totalTopics={totalTopicsCount}
              completedCount={completedCount}
              assignedCount={assignedCount}
              gradeStats={gradeStats}
              onResetProgress={handleResetProgress}
            />

            {/* Filter Pills Bar */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-subtle)', marginRight: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ListFilter size={15} /> Фильтр:
                </span>
                {filterButtons.map(filter => {
                  const isActive = statusFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                        backgroundColor: isActive ? 'var(--bg-badge)' : 'var(--bg-card)',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {filter.icon}
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filter result count */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                Найдено тем: <strong style={{ color: 'var(--text-main)' }}>{filteredTopics.length}</strong>
              </div>
            </div>

            {/* Empty State if no topics matched */}
            {filteredTopics.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <Filter size={40} style={{ color: 'var(--text-subtle)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Ничего не найдено
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  Попробуйте изменить поисковый запрос или сбросить фильтры.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1.25rem' }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View (Cards) */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.25rem'
              }}>
                {filteredTopics.map(topic => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    isCompleted={!!completedTopics[topic.id]}
                    isAssigned={!!assignedHw[topic.id]}
                    onToggleCompleted={toggleCompleted}
                    onToggleAssigned={toggleAssigned}
                    onOpenConspect={setSelectedConspectTopic}
                  />
                ))}
              </div>
            ) : (
              /* Table View (Compact List) */
              <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-stage)', color: 'var(--text-subtle)' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Параграф</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Класс</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Тема урока</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Домашнее задание</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Статус</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTopics.map(topic => (
                      <TopicRow
                        key={topic.id}
                        topic={topic}
                        isCompleted={!!completedTopics[topic.id]}
                        isAssigned={!!assignedHw[topic.id]}
                        onToggleCompleted={toggleCompleted}
                        onToggleAssigned={toggleAssigned}
                        onOpenConspect={setSelectedConspectTopic}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Conspect Modal */}
      {selectedConspectTopic && (
        <ConspectModal
          topic={selectedConspectTopic}
          isCompleted={!!completedTopics[selectedConspectTopic.id]}
          isAssigned={!!assignedHw[selectedConspectTopic.id]}
          onToggleCompleted={toggleCompleted}
          onToggleAssigned={toggleAssigned}
          onClose={() => setSelectedConspectTopic(null)}
        />
      )}

      {/* Footer */}
      <Footer
        totalTopics={totalTopicsCount}
        totalCompleted={completedCount}
        totalAssigned={assignedCount}
      />
    </div>
  );
}
