import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/*" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}
