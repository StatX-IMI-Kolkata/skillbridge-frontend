import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <h1>SkillBridge</h1>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin" style={styles.link}>Admin Panel</Link>}
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: '10px',
    backgroundColor: '#1572A1',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    marginRight: 15,
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  btn: {
    backgroundColor: '#D64550',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Header;