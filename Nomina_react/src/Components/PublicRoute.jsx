import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn
        ? <Navigate to="/listar-documentos" replace />
        : <Outlet />;
};

export default PublicRoute;