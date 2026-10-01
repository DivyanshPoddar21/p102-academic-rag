import React, { useState } from 'react';
import { LoginPage } from './pages/Login';
import { WorkspacePage } from './pages/Workspace';

export const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('academic_user'));

  const handleLogin = (username: string) => {
    localStorage.setItem('academic_user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('academic_user');
    setUser(null);
  };

  return user ? (
    <WorkspacePage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLoginSuccess={handleLogin} />
  );
};

export default App;