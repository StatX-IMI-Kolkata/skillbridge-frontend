import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api'; // ✅ correct named import
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    text: 'Which activity do you enjoy most?',
    options: [
      { label: 'Drawing or designing', value: 'design' },
      { label: 'Working with spreadsheets or typing', value: 'data-entry' },
      { label: 'Solving logic problems or coding', value: 'coding' }
    ]
  },
  {
    id: 2,
    text: 'What kind of tasks do you prefer?',
    options: [
      { label: 'Creative and visual', value: 'design' },
      { label: 'Detail oriented and repetitive', value: 'data-entry' },
      { label: 'Analytical and problem solving', value: 'coding' }
    ]
  },
  {
    id: 3,
    text: 'What is your preferred learning style?',
    options: [
      { label: 'Hands-on with creative projects', value: 'design' },
      { label: 'Structured tasks with clear steps', value: 'data-entry' },
      { label: 'Exploring new concepts and logic', value: 'coding' }
    ]
  }
];

const QuizPage = () => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions');
      return;
    }
    try {
      const payload = questions.map(q => ({ questionId: q.id, answer: answers[q.id] }));
      const res = await api.post('/users/quiz', { answers: payload });
      // Update user's track in context and localStorage
      const userStr = localStorage.getItem('user');
      const userObj = JSON.parse(userStr);
      userObj.track = res.data.track;
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);

      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit quiz');
    }
  };

  return (
    <main style={styles.container}>
      <h2>Aptitude Quiz</h2>
      <p>Answer the following questions to personalize your course track:</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {questions.map(q => (
          <div key={q.id} style={styles.question}>
            <p>{q.text}</p>
            {q.options.map(opt => (
              <label key={opt.value} style={styles.option}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt.value}
                  checked={answers[q.id] === opt.value}
                  onChange={() => handleSelect(q.id, opt.value)}
                  required
                />
                {opt.label}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  question: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5
  },
  option: {
    display: 'block',
    marginTop: 5,
    cursor: 'pointer'
  }
};

export default QuizPage;