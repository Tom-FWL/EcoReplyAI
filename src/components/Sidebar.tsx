import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Upload, 
  Image, 
  TrendingUp, 
  Brain, 
  Settings,
  Leaf,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const navigation = [
    { name: 'Live Chats', href: '/dashboard', icon: MessageSquare },
    { name: 'Chat Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Converted Deals', href: '/dashboard/deals', icon: TrendingUp },
    { name: 'AI Suggestions', href: '/dashboard/ai', icon: Brain },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">EcoReply AI</h1>
                <p className="text-sm text-gray-600">Packaging Business</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout button */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}