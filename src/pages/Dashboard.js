import React, { useEffect, useState, useContext } from 'react';
import { api } from '../api/api'; // ✅ correct named import
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [certificateUrl, setCertificateUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/users/dashboard');
        setLessons(res.data.lessons);
        setProgress(res.data.progressPercentage);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleComplete = async lessonId => {
    setMessage('');
    try {
      const res = await api.post(`/users/lesson/${lessonId}/complete`);
      setMessage('Lesson marked as completed!');
      // refresh lessons to update progress/completed status
      const res2 = await api.get('/users/dashboard');
      setLessons(res2.data.lessons);
      setProgress(res2.data.progressPercentage);

      if (res.data.allCompleted && res.data.certificateUrl) {
        setCertificateUrl(res.data.certificateUrl);
      }
    } catch (e) {
      setMessage('Error updating lesson status');
    }
  };

  return (
    <main style={styles.container}>
      <h2>Welcome, {user.name}</h2>
      <h3>Your Track: {user.track}</h3>
      <p>Progress: {progress}%</p>
      {certificateUrl && (
        <div style={styles.certificate}>
          <h3>Congratulations! Your Certificate:</h3>
          <img src={certificateUrl} alt="Certificate QR Code" style={{ maxWidth: 200 }} />
          <p>Scan this QR code to verify your certification.</p>
        </div>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <ul style={styles.lessonList}>
        {lessons.map(lesson => (
          <li key={lesson._id} style={styles.lessonItem}>
            <h4>{lesson.title}</h4>
            <p>{lesson.content}</p>
            <p><small>{lesson.durationMinutes} minutes</small></p>
            {lesson.completed ? (
              <p style={{ color: 'green' }}>Completed</p>
            ) : (
              <button onClick={() => handleComplete(lesson._id)}>Mark as Complete</button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: 'auto',
    padding: 20
  },
  lessonList: {
    listStyle: 'none',
    padding: 0,
    marginTop: 20
  },
  lessonItem: {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15
  },
  certificate: {
    marginTop: 20,
    padding: 15,
    border: '2px solid green',
    borderRadius: 5,
    textAlign: 'center'
  }
};

export default Dashboard;