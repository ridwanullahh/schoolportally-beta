import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Bell, FileText, DollarSign, Users } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ResultsModule from '@/components/users/ResultsModule';
import FeesModule from '@/components/users/FeesModule';
import SupportModule from '@/components/users/SupportModule';

const sidebarItems = [
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: "Child's Results", href: 'results', icon: FileText },
    { name: 'School Fees', href: 'fees', icon: DollarSign },
    { name: 'Support', href: 'support', icon: Users },
];

export default function ParentDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['parent']}>
            <Routes>
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="results" element={<ResultsModule />} />
                <Route path="fees" element={<FeesModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};
