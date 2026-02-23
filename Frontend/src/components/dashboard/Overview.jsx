import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Wallet, Calendar, PlusCircle, Camera, ArrowRight } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const CATEGORY_EMOJI = {
  Food: "🍛", Transport: "🚗", Accommodation: "🏨",
  Entertainment: "🎭", Shopping: "🛍️", Health: "💊",
  Education: "📚", Others: "💸",
};

const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", AED: "د.إ" };

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-sand-100 card-hover animate-slide-up`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-mono font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Overview() {
  const { dashboardData, loading, error, refresh } = useDashboard();

  const fmt = (n) => {
    const sym = CURRENCY_SYMBOLS[dashboardData?.tour?.currency] || "$";
    return `${sym}${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <MapPin size={32} className="text-sand-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">No active tour yet</h2>
        <p className="text-gray-500 mb-6">Create your first tour to start tracking expenses.</p>
        <Link to="/dashboard/tours" className="inline-flex items-center gap-2 bg-ocean-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-ocean-700 transition-colors">
          <PlusCircle size={18} /> Create a Tour
        </Link>
      </div>
    );
  }

  const { tour, totalBudget, totalExpenses, remainingBudget, dailyAvgSpent, categoryBreakdown, expenses } = dashboardData;
  const pct = Math.min(100, Math.round((totalExpenses / totalBudget) * 100));
  const recentExpenses = [...(expenses || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Tour header */}
      <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-ocean-600 to-ocean-400">
          {tour.coverPhoto && (
            <img src={tour.coverPhoto} alt={tour.tourName} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">Active Tour</span>
            </div>
            <h1 className="font-display text-2xl font-bold">{tour.tourName}</h1>
            {tour.destination && <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={12} />{tour.destination}</p>}
          </div>
          <div className="absolute bottom-4 right-6 text-white text-right">
            <p className="text-white/70 text-xs">{tour.numberOfDays} days</p>
          </div>
        </div>
        {/* Budget progress */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Budget used</span>
            <span className={`font-mono font-semibold ${pct > 80 ? "text-red-500" : pct > 60 ? "text-amber-500" : "text-green-600"}`}>{pct}%</span>
          </div>
          <div className="h-2.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${pct > 80 ? "bg-red-400" : pct > 60 ? "bg-amber-400" : "bg-ocean-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Budget" value={fmt(totalBudget)} icon={Wallet} color="bg-ocean-600" />
        <StatCard label="Total Spent" value={fmt(totalExpenses)} icon={TrendingUp} color="bg-coral-400" />
        <StatCard label="Remaining" value={fmt(remainingBudget)} icon={Wallet} color={remainingBudget < 0 ? "bg-red-500" : "bg-green-500"} />
        <StatCard label="Daily Average" value={fmt(dailyAvgSpent)} sub={`Over ${tour.numberOfDays} days`} icon={Calendar} color="bg-sand-500" />
      </div>

      {/* Lower grid: recent expenses + category breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent expenses */}
        <div className="bg-white rounded-2xl border border-sand-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900">Recent Expenses</h3>
            <Link to="/dashboard/expenses" className="text-xs text-ocean-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No expenses yet</p>
              <Link to="/dashboard/expenses" className="text-ocean-600 text-sm hover:underline mt-1 inline-block">Add your first →</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentExpenses.map((exp) => (
                <div key={exp._id} className="flex items-center gap-3 py-2.5 border-b border-sand-50 last:border-0">
                  <span className="text-xl w-8 text-center">{CATEGORY_EMOJI[exp.category] || "💸"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{exp.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {exp.time && ` · ${exp.time}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {exp.photos?.length > 0 && <Camera size={12} className="text-ocean-400" />}
                    <span className="text-sm font-mono font-semibold text-gray-900">{fmt(exp.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-sand-100 p-5">
          <h3 className="font-display font-semibold text-gray-900 mb-4">By Category</h3>
          {!categoryBreakdown || Object.keys(categoryBreakdown).length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, amt]) => {
                  const pctCat = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5">
                          {CATEGORY_EMOJI[cat]} {cat}
                        </span>
                        <span className="text-sm font-mono font-medium text-gray-900">{fmt(amt)}</span>
                      </div>
                      <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                        <div className="h-full bg-ocean-400 rounded-full" style={{ width: `${pctCat}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
