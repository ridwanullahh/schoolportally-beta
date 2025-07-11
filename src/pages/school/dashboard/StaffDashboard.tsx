import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route } from 'react-router-dom';
import { Bell, Calendar, Users } from 'lucide-react';
import AnnouncementsModule from '@/components/admin/AnnouncementsModule';
import EventsModule from '@/components/admin/EventsModule';
import SupportModule from '@/components/admin/SupportModule';

const sidebarItems = [
    { name: 'Announcements', href: 'announcements', icon: Bell, active: true },
    { name: 'Events', href: 'events', icon: Calendar },
    { name: 'Support', href: 'support', icon: Users },
];

export default function StaffDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['staff']}>
            <Routes>
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="events" element={<EventsModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};