import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Book, Calendar, Bell, FileText, Users, DollarSign } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ClassesModule from '@/components/users/ClassesModule';
import ResultsModule from '@/components/users/ResultsModule';
import FeesModule from '@/components/users/FeesModule';
import CalendarModule from '@/components/users/CalendarModule';
import ELibraryModule from '@/components/users/ELibraryModule';
import SupportModule from '@/components/users/SupportModule';

const sidebarItems = [
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: 'My Classes', href: 'classes', icon: Book },
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
                <Route path="/" element={<AnnouncementsModule />} />
                <Route path="/announcements" element={<AnnouncementsModule />} />
                <Route path="/classes" element={<ClassesModule />} />
                <Route path="/results" element={<ResultsModule />} />
                <Route path="/fees" element={<FeesModule />} />
                <Route path="/calendar" element={<CalendarModule />} />
                <Route path="/elibrary" element={<ELibraryModule />} />
                <Route path="/support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};
