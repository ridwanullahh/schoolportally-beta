import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import ParentDashboard from './ParentDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    switch (user.userType) {
        case 'student':
            return <StudentDashboard />;
        case 'teacher':
            return <TeacherDashboard />;
        case 'parent':
            return <ParentDashboard />;
        case 'staff':
            return <StaffDashboard />;
        default:
            return <Navigate to="/" />;
    }
};

export default Dashboard;