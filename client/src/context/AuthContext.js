import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ adminAuthenticated, setAdminAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);