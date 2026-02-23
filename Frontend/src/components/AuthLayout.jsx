import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-ocean-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Plane size={18} className="text-white -rotate-45" />
          </div>
          <span className="font-display font-semibold text-xl text-white">TravelBudget</span>
        </Link>
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Every journey<br />tells a story.<br /><em className="text-ocean-200">Let yours be counted.</em>
          </h2>
          <p className="text-ocean-100 text-lg">Track tours, expenses, and memories — all in one place.</p>
        </div>
        <div className="flex gap-6 relative z-10">
          {["Tours tracked", "Photos uploaded", "Money saved"].map((s, i) => (
            <div key={i}>
              <p className="font-mono font-bold text-white text-xl">{["2.4k+", "18k+", "∞"][i]}</p>
              <p className="text-ocean-200 text-xs">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center">
              <Plane size={15} className="text-white -rotate-45" />
            </div>
            <span className="font-display font-semibold text-gray-900">TravelBudget</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
