import { createContext, useContext, useState, useCallback } from "react";
import { getTours, getExpenses, getActiveTour } from "../utils/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tours, setTours] = useState(() => getTours());
  const [activeTour, setActiveTourState] = useState(() => getActiveTour());

  const refreshTours = useCallback(() => {
    const t = getTours();
    setTours(t);
    setActiveTourState(t.find((x) => x.active) || null);
  }, []);

  const getActiveTourExpenses = useCallback(() => {
    if (!activeTour) return [];
    return getExpenses(activeTour.id);
  }, [activeTour]);

  return (
    <AppContext.Provider value={{ tours, activeTour, refreshTours, getActiveTourExpenses }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
