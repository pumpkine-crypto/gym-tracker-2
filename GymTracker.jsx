import React, { useState, useEffect } from 'react';

const GymTracker = () => {
  const [routine, setRoutine] = useState({});
  const [completed, setCompleted] = useState({});
  const [currentDay, setCurrentDay] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gymRoutine');
    const savedCompleted = localStorage.getItem('gymCompleted');
    const savedDate = localStorage.getItem('gymDate');
    const today = new Date().toDateString();

    if (saved) setRoutine(JSON.parse(saved));
    
    // Check if it's a new day
    if (savedDate !== today) {
      setCompleted({});
      localStorage.setItem('gymCompleted', '{}');
      localStorage.setItem('gymDate', today);
    } else if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }

    const now = new Date();
    setCurrentDay(dayNames[now.getDay()]);
  }, []);

  // Parse routine text
  const parseRoutine = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = {};
    let currentDay = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      const dayMatch = dayNames.find(day => 
        trimmed.toLowerCase().includes(day.toLowerCase()) && 
        (trimmed.split(' ').length <= 3 || /^[a-zA-Z]+$/.test(trimmed.split(' ')[0]))
      );

      if (dayMatch) {
        currentDay = dayMatch;
        if (!parsed[currentDay]) parsed[currentDay] = [];
      } else if (currentDay && trimmed) {
        // Remove leading numbers, dashes, or bullets
        const exercise = trimmed.replace(/^[\d\.\-\*]\s*/, '').trim();
        if (exercise) parsed[currentDay].push(exercise);
      }
    });

    return parsed;
  };

  // Handle routine submission
  const handleSetRoutine = () => {
    const parsed = parseRoutine(textInput);
    if (Object.keys(parsed).length > 0) {
      setRoutine(parsed);
      localStorage.setItem('gymRoutine', JSON.stringify(parsed));
      setTextInput('');
      setShowInput(false);
    }
  };

  // Handle checkbox
  const handleCheck = (exercise) => {
    const key = `${currentDay}-${exercise}`;
    if (!completed[key]) {
      const updated = { ...completed, [key]: true };
      setCompleted(updated);
      localStorage.setItem('gymCompleted', JSON.stringify(updated));
    }
  };

  // Handle password reset
  const handlePasswordReset = () => {
    if (passwordInput === 'Tanzeem') {
      localStorage.removeItem('gymRoutine');
      localStorage.removeItem('gymCompleted');
      localStorage.removeItem('gymDate');
      setRoutine({});
      setCompleted({});
      setPasswordInput('');
      setPasswordError('');
      setShowPassword(false);
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const todayExercises = routine[currentDay] || [];
  const hasRoutine = Object.keys(routine).length > 0;

  // Get actual today's day name
  const actualToday = dayNames[new Date().getDay()];
  const isActualToday = currentDay === actualToday;

  const handleDayClick = (day) => {
    setCurrentDay(day);
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header with menu button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {hasRoutine ? currentDay : 'Gym Tracker'}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {hasRoutine && 'Crush your workout'}
          </p>
        </div>
        <button
          onClick={() => setShowPassword(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '32px',
            cursor: 'pointer',
            padding: '8px',
            transition: 'transform 0.2s',
            hover: { transform: 'scale(1.1)' }
          }}
        >
          🗿
        </button>
      </div>

      {/* Main content */}
      {!hasRoutine ? (
        <div style={{ textAlign: 'center' }}>
          {!showInput ? (
            <div style={{ padding: '2rem 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '1.5rem', opacity: 0.3 }}>💪</div>
              <p style={{ marginBottom: '1.5rem', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Paste your gym routine to get started.<br />Include day names as headers.
              </p>
              <button
                onClick={() => setShowInput(true)}
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
                }}
              >
                Add Routine
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Monday&#10;Bench Press&#10;Squats&#10;Rows&#10;&#10;Tuesday&#10;Deadlifts&#10;Pull-ups"
                style={{
                  width: '100%',
                  height: '220px',
                  padding: '14px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  resize: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSetRoutine}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  Save Routine
                </button>
                <button
                  onClick={() => { setShowInput(false); setTextInput(''); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {todayExercises.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todayExercises.map((exercise, idx) => {
                const key = `${currentDay}-${exercise}`;
                const isChecked = completed[key] || false;
                const canCheck = isActualToday && !isChecked;
                return (
                  <div
                    key={idx}
                    onClick={() => canCheck && handleCheck(exercise)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      cursor: canCheck ? 'pointer' : 'default',
                      backgroundColor: isChecked ? 'rgba(52, 199, 89, 0.08)' : 'var(--bg-card)',
                      opacity: !isActualToday ? 0.5 : isChecked ? 0.6 : 1,
                      transition: 'all 0.2s',
                      borderColor: isChecked ? 'rgba(52, 199, 89, 0.2)' : 'var(--border)',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      pointerEvents: !isActualToday ? 'none' : 'auto'
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        minWidth: '24px',
                        borderRadius: '6px',
                        border: `2.5px solid ${isChecked ? 'var(--success)' : 'var(--border-light)'}`,
                        backgroundColor: isChecked ? 'var(--success)' : 'transparent',
                        marginRight: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isChecked && <span style={{ color: '#000', fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{
                      fontSize: '15px',
                      color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      textDecorationThickness: isChecked ? '2px' : '0px',
                      textDecorationColor: isChecked ? 'var(--text-muted)' : 'transparent',
                      textUnderlineOffset: isChecked ? '3px' : '0px',
                      fontWeight: isChecked ? 400 : 500,
                      flex: 1
                    }}>
                      {exercise}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.3 }}>😴</div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No exercises for {currentDay}</p>
              <button
                onClick={() => setShowInput(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Edit Routine
              </button>
            </div>
          )}
        </div>
      )}

      {/* Password modal */}
      {showPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '320px',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Reset App</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem' }}>
              Enter password to reset everything and start fresh.
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: `1px solid ${passwordError ? 'var(--danger)' : 'var(--border-light)'}`,
                borderRadius: '10px',
                fontSize: '14px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                marginBottom: passwordError ? '8px' : '1.5rem',
                transition: 'border-color 0.2s'
              }}
            />
            {passwordError && (
              <p style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                ❌ {passwordError}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePasswordReset}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowPassword(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Day selector at bottom */}
      {hasRoutine && (
        <div style={{
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {dayNames.map((day) => {
            const hasExercises = routine[day] && routine[day].length > 0;
            const isCurrentDay = day === currentDay;
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: isCurrentDay ? 'var(--accent)' : hasExercises ? 'var(--bg-tertiary)' : 'transparent',
                  color: isCurrentDay ? '#fff' : hasExercises ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: `1px solid ${isCurrentDay ? 'var(--accent)' : hasExercises ? 'var(--border-light)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  cursor: hasExercises ? 'pointer' : 'default',
                  fontWeight: isCurrentDay ? 600 : 500,
                  fontSize: '12px',
                  transition: 'all 0.2s',
                  opacity: hasExercises ? 1 : 0.5,
                  boxShadow: isCurrentDay ? '0 0 0 3px rgba(0, 122, 255, 0.2)' : 'none'
                }}
                disabled={!hasExercises}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GymTracker;
