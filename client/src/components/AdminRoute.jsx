// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { adminAuthenticated } = useAuth();

  return adminAuthenticated ? children : <Navigate to="/admin" replace />;
};

export default AdminRoute;
