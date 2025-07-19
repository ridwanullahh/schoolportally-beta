import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: 'My Classes', href: 'classes', icon: Book },
    { name: 'My Subjects', href: 'subjects', icon: BookOpen },
    { name: 'My Results', href: 'results', icon: FileText },
    { name: 'My Fees', href: 'fees', icon: DollarSign },
    { name: 'Calendar', href: 'calendar', icon: Calendar },
    { name: 'E-Library', href: 'elibrary', icon: Book },
    { name: 'Support', href: 'support', icon: Users },
];

export default function StudentDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['student']}>
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
        </DashboardLayout>
    );
};
