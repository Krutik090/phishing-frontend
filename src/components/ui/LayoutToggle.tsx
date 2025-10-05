import { LayoutDashboard, LayoutList } from "lucide-react";
import { useLayout } from "../../context/LayoutContext";

export function LayoutToggle() {
  const { layoutMode, setLayoutMode } = useLayout();

  return (
    <button
      onClick={() => setLayoutMode(layoutMode === "sidebar" ? "header" : "sidebar")}
      className="p-2 rounded-md hover:bg-accent transition-colors"
      title={`Switch to ${layoutMode === "sidebar" ? "header" : "sidebar"} layout`}
    >
      {layoutMode === "sidebar" ? (
        <LayoutList className="w-5 h-5 text-foreground" />
      ) : (
        <LayoutDashboard className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
}
