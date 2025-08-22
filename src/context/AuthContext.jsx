import React, { createContext, useState, useEffect } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData && userData !== 'undefined' ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));


  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  }, [token]);


  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };


  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



export default AuthContext;
