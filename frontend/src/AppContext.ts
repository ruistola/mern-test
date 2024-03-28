import { createContext, useContext } from "react";

export interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: useAppContext,
});

export function useAppContext() {
  return useContext(AppContext);
}
