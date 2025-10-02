import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isSidebarOpen={isSidebarOpen} onMenuToggle={toggleSidebar} />
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
