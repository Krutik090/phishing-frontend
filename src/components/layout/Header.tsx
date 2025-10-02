import { Menu, X, Bell, Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ isSidebarOpen, onMenuToggle }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white dark:bg-[hsl(var(--background))] border-b border-border shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-foreground hover:bg-card transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo - Hidden on mobile when sidebar is open */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
          </div>
        </div>
            
        {/* Center Section - Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-card transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-foreground hover:bg-card transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-foreground hover:bg-card transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative ml-2">
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <span className="hidden lg:block text-sm font-medium text-foreground">
                John Doe
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4 border-t border-border bg-white dark:bg-[hsl(var(--background))]">
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      )}
    </header>
  );
}
