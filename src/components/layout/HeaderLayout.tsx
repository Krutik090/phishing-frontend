import { Outlet } from 'react-router-dom';
import { HeaderNav } from './HeaderNav';

export function HeaderLayout() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      
      <main className="pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
