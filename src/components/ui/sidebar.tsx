import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

export const Sidebar = ({ isOpen, setIsOpen, children }: SidebarProps) => {
    return (
        <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 py-4 overflow-y-auto`}>
            <div className="flex items-center justify-between px-6 mb-8">
                <h1 className={`text-lg font-semibold transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Admin</h1>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>
            {children}
        </div>
    );
};
