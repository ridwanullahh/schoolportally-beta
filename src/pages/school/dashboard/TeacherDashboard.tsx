import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Book, Bell, Users } from 'lucide-react';
import AnnouncementsModule from '@/components/admin/AnnouncementsModule';
import ClassesModule from '@/components/admin/ClassesModule';
import LMSModule from '@/components/admin/LMSModule';
import SupportModule from '@/components/admin/SupportModule';

const sidebarItems = [
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: 'My Classes', href: 'classes', icon: Book },
    { name: 'LMS', href: 'lms', icon: Book },
    { name: 'Support', href: 'support', icon: Users },
];

export default function TeacherDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['teacher']}>
            <Routes>
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="classes" element={<ClassesModule />} />
                <Route path="lms" element={<LMSModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};
