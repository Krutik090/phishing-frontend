import { NavLink } from 'react-router-dom';
import { navItems } from '../../config/navConfig';
import { ShieldCheck, LogOut, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isSidebarOpen, collapsed, setCollapsed }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[hsl(var(--card))] border-r border-border z-40
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64 shadow-xl lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-card-foreground">
                  Phish Admin
                </span>
              </div>
            )}
            
            {/* Collapse Button (Desktop Only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-card-foreground/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={`w-5 h-5 text-card-foreground transition-transform duration-300 ${
                  collapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 relative
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-card-foreground hover:bg-card-foreground/10'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Bar */}
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                    )}
                    
                    {/* Icon */}
                    <item.icon 
                      className={`
                        w-5 h-5 flex-shrink-0 transition-transform duration-200
                        ${!isActive && 'group-hover:scale-110'}
                      `}
                    />
                    
                    {/* Label */}
                    {!collapsed && (
                      <span className="font-medium text-sm whitespace-nowrap">
                        {item.title}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-3 border-t border-border flex-shrink-0" />

          {/* Bottom Actions */}
          <div className="p-3 space-y-1 flex-shrink-0">
            {/* Logout */}
            <button
              className={`
                group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Logout</span>}
              
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>

          {/* User Profile (Bottom) */}
          {!collapsed && (
            <div className="p-3 border-t border-border flex-shrink-0">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-foreground/10 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium flex-shrink-0">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    admin@company.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
