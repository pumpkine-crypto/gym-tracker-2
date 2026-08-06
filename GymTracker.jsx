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

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* Header with menu button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
          {hasRoutine ? currentDay : 'Gym Tracker'}
        </h1>
        <button
          onClick={() => setShowPassword(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          🗿
        </button>
      </div>

      {/* Main content */}
      {!hasRoutine ? (
        <div style={{ textAlign: 'center', color: '#666' }}>
          {!showInput ? (
            <div>
              <p style={{ marginBottom: '1rem', fontSize: '14px' }}>
                Paste your gym routine to get started. Include day names as headers.
              </p>
              <button
                onClick={() => setShowInput(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007AFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
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
                  height: '200px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSetRoutine}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Save Routine
                </button>
                <button
                  onClick={() => { setShowInput(false); setTextInput(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayExercises.map((exercise, idx) => {
                const key = `${currentDay}-${exercise}`;
                const isChecked = completed[key] || false;
                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: isChecked ? 'default' : 'pointer',
                      backgroundColor: isChecked ? '#f0f8ff' : 'white',
                      opacity: isChecked ? 0.8 : 1,
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheck(exercise)}
                      disabled={isChecked}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginRight: '12px',
                        cursor: isChecked ? 'default' : 'pointer'
                      }}
                    />
                    <span style={{
                      fontSize: '15px',
                      color: isChecked ? '#888' : '#333',
                      textDecoration: isChecked ? 'line-through' : 'none'
                    }}>
                      {exercise}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: '2rem 0' }}>
              <p style={{ fontSize: '14px' }}>No exercises for {currentDay}</p>
              <button
                onClick={() => setShowInput(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '18px' }}>Reset App</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
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
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginBottom: passwordError ? '6px' : '1rem'
              }}
            />
            {passwordError && (
              <p style={{ color: '#FF3B30', fontSize: '12px', marginBottom: '1rem', margin: 0 }}>
                {passwordError}
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePasswordReset}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#FF3B30',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500
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
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymTracker;
