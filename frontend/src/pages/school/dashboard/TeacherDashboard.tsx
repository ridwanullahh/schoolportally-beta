import React from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Book, Bell, Users, BookOpen } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ClassesModule from '@/components/users/ClassesModule';
import SubjectsUserModule from '@/components/users/SubjectsUserModule';
import SubjectPage from '../SubjectPage';
import LMSModule from '@/components/users/LMSModule';
import SupportModule from '@/components/users/SupportModule';

const sidebarItems = [
    { id: 'announcements', label: 'Announcements', href: 'announcements', icon: Bell },
    { id: 'classes', label: 'My Classes', href: 'classes', icon: Book },
    { id: 'subjects', label: 'My Subjects', href: 'subjects', icon: BookOpen },
    { id: 'lms', label: 'LMS', href: 'lms', icon: Book },
    { id: 'support', label: 'Support', href: 'support', icon: Users },
];

export default function TeacherDashboard() {
    return (
        <ModernDashboardLayout
            sidebarItems={sidebarItems}
            allowedRoles={['teacher']}
            title="Teacher Dashboard"
            subtitle="Manage your classes and subjects"
        >
            <Routes>
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="classes" element={<ClassesModule />} />
                <Route path="subjects" element={<SubjectsUserModule />} />
                <Route path="subjects/:subjectId" element={<SubjectPage />} />
                <Route path="lms" element={<LMSModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </ModernDashboardLayout>
    );
};
