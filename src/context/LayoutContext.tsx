import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type LayoutMode = "sidebar" | "header";

type LayoutProviderProps = {
  children: ReactNode;
  defaultLayout?: LayoutMode;
  storageKey?: string;
};

type LayoutProviderState = {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
};

const LayoutContext = createContext<LayoutProviderState | undefined>(undefined);

export function LayoutProvider({
  children,
  defaultLayout = "sidebar",
  storageKey = "phishing-app-layout",
}: LayoutProviderProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    const stored = localStorage.getItem(storageKey);
    return (stored as LayoutMode) || defaultLayout;
  });

  const value = {
    layoutMode,
    setLayoutMode: (mode: LayoutMode) => {
      localStorage.setItem(storageKey, mode);
      setLayoutMode(mode);
    },
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined)
    throw new Error("useLayout must be used within a LayoutProvider");
  return context;
};
