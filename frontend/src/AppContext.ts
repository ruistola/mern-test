import { createContext, useContext } from "react";

export interface AppContextType {
  authToken: string;
  setAuthToken: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({
  authToken: "",
  setAuthToken: useAppContext,
});

export function useAppContext() {
  return useContext(AppContext);
}
