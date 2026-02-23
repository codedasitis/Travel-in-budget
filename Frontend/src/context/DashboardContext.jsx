import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setDashboardData(null); // No active tour
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllTours = useCallback(async () => {
    try {
      const res = await api.get("/tours");
      setAllTours(res.data.tours || []);
    } catch (err) {
      console.error("Fetch tours error:", err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchAllTours()]);
  }, [fetchDashboard, fetchAllTours]);

  return (
    <DashboardContext.Provider
      value={{ dashboardData, allTours, loading, error, fetchDashboard, fetchAllTours, refresh }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
