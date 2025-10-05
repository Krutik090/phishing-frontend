import { NavLink } from 'react-router-dom';
import { navGroups } from '../../config/navConfig';
import { ShieldCheck, LogOut, ChevronLeft, ChevronDown, Settings, UserCog } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isSidebarOpen: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isSidebarOpen, collapsed, setCollapsed }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Operations', 'Learning']);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Header with Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Phish Admin</h1>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center w-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          )}

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1.5 rounded-md hover:bg-accent transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-5 h-5 text-foreground transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navGroups.map((group, groupIndex) => {
            // Standalone items (Dashboard, Campaigns)
            if (!group.title) {
              return (
                <div key={groupIndex} className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                          collapsed ? 'justify-center' : ''
                        } ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                        }`
                      }
                      title={collapsed ? item.title : ''}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  ))}
                </div>
              );
            }

            // Grouped items with collapsible sections
            const isExpanded = expandedGroups.includes(group.title);

            return (
              <div key={groupIndex} className="space-y-1">
                {/* Group Header */}
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <span>{group.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Group Items */}
                {(collapsed || isExpanded) && (
                  <div className={collapsed ? 'space-y-1' : 'space-y-1 pl-2'}>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            collapsed ? 'justify-center' : ''
                          } ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                          }`
                        }
                        title={collapsed ? item.title : ''}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* User Management - Standalone */}
          <NavLink
            to="/user-management"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
              }`
            }
            title={collapsed ? 'User Management' : ''}
          >
            <UserCog className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>User Management</span>}
          </NavLink>
        </nav>

        {/* Footer - Settings & Logout */}
        <div className="border-t border-border p-4 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
              }`
            }
            title={collapsed ? 'Settings' : ''}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-destructive hover:bg-accent transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
