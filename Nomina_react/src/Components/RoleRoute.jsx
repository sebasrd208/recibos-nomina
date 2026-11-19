import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ allowedRoles }) {
  const { role, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;