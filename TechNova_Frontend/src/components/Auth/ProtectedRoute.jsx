import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { selectAuth } from '../../redux/slices/authSlice';

const ProtectedRoute = ({ allowedRoles = ['user', 'admin'] }) => {
    const { isAuthenticated, user, role } = useAppSelector(selectAuth);
    const location = useLocation();

    if (!isAuthenticated || !user) {
        // Redirect to login, but save the current location so we can come back
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(role)) {
        // If user is logged in but doesn't have the right role (e.g. applicant trying to see admin)
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
