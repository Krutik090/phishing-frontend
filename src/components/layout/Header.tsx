import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LayoutToggle } from '../ui/LayoutToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  collapsed: boolean; // Add this prop
}

export function Header({ isSidebarOpen, onMenuToggle, collapsed }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={`
        fixed top-0 right-0 z-40 h-16 bg-card border-b border-border
        transition-all duration-300
        ${collapsed ? 'lg:left-20' : 'lg:left-64'}
        left-0
      `}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Side - Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>

        {/* Center - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
              onFocus={() => setShowSearch(true)}
              onBlur={() => setShowSearch(false)}
            />
          </div>
        </div>
        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          <LayoutToggle />
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <span className="hidden md:inline text-sm font-medium text-foreground">
              John Doe
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
