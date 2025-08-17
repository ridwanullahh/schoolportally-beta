import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    switch (user.userType) {
        case 'school_admin':
        case 'school_owner':
            return <Navigate to="admin" replace />;
        case 'student':
            return <Navigate to="student" replace />;
        case 'teacher':
            return <Navigate to="teacher" replace />;
        case 'parent':
            return <Navigate to="parent" replace />;
        case 'staff':
            return <Navigate to="staff" replace />;
        default:
            return <div>Invalid user role</div>;
    }
};