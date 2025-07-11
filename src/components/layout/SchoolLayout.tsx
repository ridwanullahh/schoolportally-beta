import React, { useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { Sidebar } from '@/components/ui/sidebar';

export const SchoolLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}><></></Sidebar>
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