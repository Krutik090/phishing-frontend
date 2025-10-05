import { useLayout } from '../../context/LayoutContext';
import { SidebarLayout } from './SidebarLayout';
import { HeaderLayout } from './HeaderLayout';

export function Layout() {
  const { layoutMode } = useLayout();

  if (layoutMode === "header") {
    return <HeaderLayout />;
  }

  return <SidebarLayout />;
}
