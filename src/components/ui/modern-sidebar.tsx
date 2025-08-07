import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, ChevronRight, Menu, X, Bell, Settings, 
  LogOut, User, Search, Home, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface ModernSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: SidebarItem[];
  children?: React.ReactNode;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  setIsOpen,
  items,
  children
}) => {
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (href: string) => {
    return location.pathname.includes(href);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
      case 'super_admin':
        return 'bg-red-500';
      case 'teacher':
        return 'bg-blue-500';
      case 'student':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const SidebarItemComponent: React.FC<{ item: SidebarItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = item.href ? isActive(item.href) : false;

    return (
      <div className="w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12 px-3 mb-1 transition-all duration-200",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            itemIsActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-700",
            !itemIsActive && "hover:bg-gray-50 text-gray-700",
            !isOpen && "justify-center px-0"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            }
          }}
          asChild={!hasChildren}
        >
          {hasChildren ? (
            <div className="flex items-center w-full">
              <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 h-5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-90"
                    )} 
                  />
                </>
              )}
            </div>
          ) : (
            <Link to={item.href || '#'} className="flex items-center w-full">
              <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 h-5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}
        </Button>

        {/* Children */}
        {hasChildren && isExpanded && isOpen && (
          <div className="ml-2 border-l border-gray-200 pl-2">
            {item.children?.map(child => (
              <SidebarItemComponent 
                key={child.id} 
                item={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-full",
      isOpen ? "w-72" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {school?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">
                  {school?.name || 'School Portal'}
                </h2>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role} Dashboard
                </p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">
                {school?.name?.charAt(0) || 'S'}
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search */}
        {isOpen && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {filteredItems.map(item => (
            <SidebarItemComponent key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {isOpen ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className={cn("text-white", getRoleColor())}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="flex-1 h-8">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className={cn("text-white text-xs", getRoleColor())}>
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebar;
