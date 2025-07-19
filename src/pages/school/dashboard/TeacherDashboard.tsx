import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Book, Bell, Users, BookOpen } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ClassesModule from '@/components/users/ClassesModule';
import SubjectsUserModule from '@/components/users/SubjectsUserModule';
import SubjectPage from '../SubjectPage';
import LMSModule from '@/components/users/LMSModule';
import SupportModule from '@/components/users/SupportModule';

const sidebarItems = [
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: 'My Classes', href: 'classes', icon: Book },
    { name: 'My Subjects', href: 'subjects', icon: BookOpen },
    { name: 'LMS', href: 'lms', icon: Book },
    { name: 'Support', href: 'support', icon: Users },
];

export default function TeacherDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['teacher']}>
            <Routes>
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="classes" element={<ClassesModule />} />
                <Route path="subjects" element={<SubjectsUserModule />} />
                <Route path="subjects/:subjectId" element={<SubjectPage />} />
                <Route path="lms" element={<LMSModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};
