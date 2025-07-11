import React, { useEffect, useState } from 'react';
import { api } from '../api/api'; // ✅ correct named import


const AdminPanel = () => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ track: 'design', title: '', content: '', durationMinutes: 10 });
  const [message, setMessage] = useState('');

  const fetchLessons = async () => {
    const res = await api.get('/admin/lessons');
    setLessons(res.data.lessons);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async e => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/admin/lessons', form);
      setMessage('Lesson uploaded. Awaiting approval.');
      setForm({ track: 'design', title: '', content: '', durationMinutes: 10 });
      fetchLessons();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Upload failed');
    }
  };

  const toggleApproval = async (id, current) => {
    try {
      await api.patch(`/admin/lessons/${id}/approve`, { approved: !current });
      fetchLessons();
    } catch (e) {
      setMessage('Failed to update approval');
    }
  };

  return (
    <main style={styles.container}>
      <h2>Admin Panel</h2>
      <section>
        <h3>Upload New Lesson</h3>
        <form onSubmit={handleUpload} style={styles.form}>
          <label>
            Track:
            <select name="track" value={form.track} onChange={handleChange}>
              <option value="design">Design</option>
              <option value="data-entry">Data Entry</option>
              <option value="coding">Coding</option>
            </select>
          </label>
          <input type="text" name="title" placeholder="Lesson Title" value={form.title} onChange={handleChange} required />
          <textarea name="content" placeholder="Lesson Content (text)" value={form.content} onChange={handleChange} required rows={5} />
          <input type="number" name="durationMinutes" min="5" max="60" value={form.durationMinutes} onChange={handleChange} />
          <button type="submit">Upload Lesson</button>
        </form>
        {message && <p>{message}</p>}
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>Approve Lessons</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Track</th>
              <th>Title</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson._id}>
                <td>{lesson.track}</td>
                <td>{lesson.title}</td>
                <td>{lesson.approved ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => toggleApproval(lesson._id, lesson.approved)}>
                    {lesson.approved ? 'Reject' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

const styles = {
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: 20
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 400
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20
  }
};

export default AdminPanel;