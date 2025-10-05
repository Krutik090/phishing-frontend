import { NavLink } from 'react-router-dom';
import { Bell, Search, Moon, Sun, ChevronDown, ShieldCheck, UserCog, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { navGroups } from '../../config/navConfig';

export function HeaderNav() {
  const { theme, setTheme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Logo + Nav */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Phish Admin</span>
          </NavLink>

          {/* Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((group, groupIndex) => {
              // Standalone items (Dashboard, Campaigns)
              if (!group.title) {
                return group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </NavLink>
                ));
              }

              // Grouped dropdowns with better hover behavior
              return (
                <div
                  key={groupIndex}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(group.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors">
                    {group.title}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu with padding for easier access */}
                  {activeDropdown === group.title && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="w-56 bg-card border border-border rounded-lg shadow-xl py-2 z-50">
                        {group.items.map((item) => (
                          <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* User Management - Standalone */}
            <NavLink
              to="/user-management"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`
              }
            >
              <UserCog className="w-4 h-4" />
              <span>User Management</span>
            </NavLink>
          </nav>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon (expands to input) */}
          {showSearch ? (
            <div className="relative animate-in fade-in slide-in-from-right-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                onBlur={() => setShowSearch(false)}
                className="w-64 pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* User Profile with Settings Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              <span className="hidden md:inline text-sm font-medium text-foreground">
                John Doe
              </span>
              <ChevronDown className="w-4 h-4 text-foreground/60" />
            </button>

            {/* User Dropdown Menu with padding */}
            {showUserMenu && (
              <div className="absolute top-full right-0 pt-2">
                <div className="w-48 bg-card border border-border rounded-lg shadow-xl py-2 z-50">
                  <NavLink
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </NavLink>
                  <hr className="my-2 border-border" />
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
