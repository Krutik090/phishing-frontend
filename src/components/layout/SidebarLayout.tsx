import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function SidebarLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onMenuToggle={toggleSidebar}
        collapsed={collapsed}
      />
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <main 
        className={`
          pt-16 transition-all duration-300
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
