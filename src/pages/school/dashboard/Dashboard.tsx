import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import ParentDashboard from './ParentDashboard';
import StaffDashboard from './StaffDashboard';
import SchoolAdminDashboard from '../admin/SchoolAdminDashboard';

const Dashboard: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    let dashboardComponent;
    switch (user.userType) {
        case 'student':
            dashboardComponent = <StudentDashboard />;
            break;
        case 'teacher':
            dashboardComponent = <TeacherDashboard />;
            break;
        case 'parent':
            dashboardComponent = <ParentDashboard />;
            break;
        case 'staff':
            dashboardComponent = <StaffDashboard />;
            break;
        case 'school_admin':
        case 'school_owner':
            dashboardComponent = <SchoolAdminDashboard />;
            break;
        default:
            return <Navigate to="/" />;
    }

    return (
       <>
           {React.cloneElement(dashboardComponent, { children: <Outlet /> })}
       </>
    )
};

export default Dashboard;