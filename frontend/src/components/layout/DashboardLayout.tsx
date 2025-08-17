import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: any[];
    allowedRoles: string[];
}

export const DashboardLayout = ({ children, sidebarItems, allowedRoles }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    const hasAccess = user && allowedRoles.some(role => user.roles.includes(role));

    if (!hasAccess) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p>You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    const activePath = location.pathname.split('/').pop();

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
                <div className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.name}
                            variant={activePath === item.href ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            asChild
                        >
                            <Link to={item.href}>
                                <item.icon className="w-4 h-4 mr-2" />
                                {isSidebarOpen && item.name}
                            </Link>
                        </Button>
                    ))}
                </div>
            </Sidebar>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};