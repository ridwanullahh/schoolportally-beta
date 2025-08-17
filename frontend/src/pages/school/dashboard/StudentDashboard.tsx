import React from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Book, Calendar, Bell, FileText, Users, DollarSign, BookOpen } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ClassesModule from '@/components/users/ClassesModule';
import SubjectsUserModule from '@/components/users/SubjectsUserModule';
import SubjectPage from '../SubjectPage';
import ResultsModule from '@/components/users/ResultsModule';
import FeesModule from '@/components/users/FeesModule';
import CalendarModule from '@/components/users/CalendarModule';
import ELibraryModule from '@/components/users/ELibraryModule';
import SupportModule from '@/components/users/SupportModule';

const sidebarItems = [
    { id: 'announcements', label: 'Announcements', href: 'announcements', icon: Bell },
    { id: 'classes', label: 'My Classes', href: 'classes', icon: Book },
    { id: 'subjects', label: 'My Subjects', href: 'subjects', icon: BookOpen },
    { id: 'results', label: 'My Results', href: 'results', icon: FileText },
    { id: 'fees', label: 'My Fees', href: 'fees', icon: DollarSign },
    { id: 'calendar', label: 'Calendar', href: 'calendar', icon: Calendar },
    { id: 'elibrary', label: 'E-Library', href: 'elibrary', icon: Book },
    { id: 'support', label: 'Support', href: 'support', icon: Users },
];

export default function StudentDashboard() {
    return (
        <ModernDashboardLayout
            sidebarItems={sidebarItems}
            allowedRoles={['student']}
            title="Student Dashboard"
            subtitle="Access your classes and resources"
        >
            <Routes>
               <Route path="/">
                   <Route index element={<AnnouncementsModule />} />
                   <Route path="announcements" element={<AnnouncementsModule />} />
                   <Route path="classes" element={<ClassesModule />} />
                   <Route path="subjects" element={<SubjectsUserModule />} />
                   <Route path="subjects/:subjectId" element={<SubjectPage />} />
                   <Route path="results" element={<ResultsModule />} />
                   <Route path="fees" element={<FeesModule />} />
                   <Route path="calendar" element={<CalendarModule />} />
                   <Route path="elibrary" element={<ELibraryModule />} />
                   <Route path="support" element={<SupportModule />} />
               </Route>
            </Routes>
        </ModernDashboardLayout>
    );
};
