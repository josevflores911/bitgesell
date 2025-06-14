import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Login from './Login';
import { DataProvider } from '../state/DataContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <DataProvider>
      <nav style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        {token ? (
          <>
            <Link to="/">Items</Link>{' '}
            <button onClick={handleLogout} style={{ marginLeft: 8 }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        {!token ? (
          <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem('token'))} />} />
        ) : (
          <>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </>
        )}
      </Routes>
    </DataProvider>
  );
}

export default App;
