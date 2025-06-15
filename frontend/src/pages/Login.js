import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch('http://localhost:3001/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    alert('Login failed');
    return;
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);

   if (onLogin) onLogin(); // update token in App

  navigate('/'); // navigate after update
};

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
