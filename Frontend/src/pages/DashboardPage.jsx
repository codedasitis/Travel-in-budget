import { Routes, Route, NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Map, Menu, Plane } from "lucide-react";
import { useState } from "react";
import Overview from "../components/dashboard/Overview";
import ExpenseTracker from "../components/dashboard/ExpenseTracker";
import ToursManager from "../components/dashboard/ToursManager";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/tours", icon: Map, label: "My Tours" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-sand-100 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-sand-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-ocean-600 rounded-xl flex items-center justify-center">
              <Plane size={17} className="text-white -rotate-45" />
            </div>
            <div>
              <p className="font-display font-semibold text-gray-900 leading-none">TravelBudget</p>
              <p className="text-xs text-gray-400 mt-0.5">Expense Tracker</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-ocean-50 text-ocean-700 border border-ocean-100" : "text-gray-500 hover:bg-sand-50 hover:text-gray-900"}`}>
              <item.icon size={18} />{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sand-100">
          <p className="text-xs text-gray-400 text-center">Data saved on this device</p>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-sand-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-sand-50">
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ocean-600 rounded-lg flex items-center justify-center">
              <Plane size={13} className="text-white -rotate-45" />
            </div>
            <span className="font-display font-semibold text-gray-900">TravelBudget</span>
          </div>
          <div className="w-9" />
        </header>
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="expenses" element={<ExpenseTracker />} />
            <Route path="tours" element={<ToursManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
