import { Link } from "react-router-dom";
import { MapPin, Camera, DollarSign, BarChart3, ArrowRight, Plane, Globe, Shield } from "lucide-react";

const features = [
  { icon: MapPin, title: "Name Your Tour", desc: "Give each adventure a name. Keep multiple tours organized in one place." },
  { icon: DollarSign, title: "Track Spending", desc: "Log every expense with amount, category, and notes as you go." },
  { icon: Camera, title: "Photo Memories", desc: "Attach up to 5 photos per expense. Relive where your money went." },
  { icon: BarChart3, title: "Spending Summary", desc: "See your total spent, remaining budget, and daily averages at a glance." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sand-50 font-body">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sand-50/90 backdrop-blur-sm border-b border-sand-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center">
              <Plane size={16} className="text-white -rotate-45" />
            </div>
            <span className="font-display font-semibold text-lg text-gray-900">TravelBudget</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium bg-ocean-600 text-white px-5 py-2 rounded-lg hover:bg-ocean-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-ocean-100 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-sand-200 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white border border-sand-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Globe size={14} className="text-ocean-600" />
            <span className="text-sm text-gray-600 font-medium">Track every adventure, every rupee</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
            Your travel money,
            <br />
            <em className="text-ocean-600 not-italic">finally organized</em>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create tours, log expenses with photos, and see exactly where your travel budget goes —
            all in one clean, simple app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-ocean-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-ocean-700 transition-all hover:shadow-lg hover:shadow-ocean-200 group"
            >
              Start tracking free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-700 transition-colors font-medium py-4 px-2">
              Already have an account?
            </Link>
          </div>
        </div>

        {/* Hero visual — mock dashboard card */}
        <div className="max-w-2xl mx-auto mt-16 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200 border border-sand-100 p-6 relative">
            <div className="absolute -top-3 -right-3 bg-ocean-600 text-white text-xs font-mono px-3 py-1 rounded-full">
              Live Preview
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Active Tour</p>
                <h3 className="font-display text-xl font-semibold text-gray-900">Rajasthan Road Trip 🏜️</h3>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "Total Budget", value: "₹45,000", color: "text-gray-900" },
                { label: "Total Spent", value: "₹28,350", color: "text-coral-500" },
                { label: "Remaining", value: "₹16,650", color: "text-green-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-sand-50 rounded-xl p-3 text-center">
                  <p className={`text-lg font-mono font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Fake progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Budget used</span>
                <span>63%</span>
              </div>
              <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full w-[63%] bg-gradient-to-r from-ocean-500 to-coral-400 rounded-full" />
              </div>
            </div>
            {/* Fake expense rows */}
            {[
              { cat: "🍛 Food", desc: "Dal Baati dinner", amount: "₹850", date: "Today, 8:30 PM", hasPhoto: true },
              { cat: "🚗 Transport", desc: "Jaipur to Jodhpur taxi", amount: "₹3,200", date: "Today, 2:00 PM", hasPhoto: false },
              { cat: "🏨 Stay", desc: "Heritage haveli stay", amount: "₹4,500", date: "Yesterday", hasPhoto: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-t border-sand-100">
                <div className="flex items-center gap-3">
                  <span className="text-base">{row.cat.split(" ")[0]}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{row.desc}</p>
                    <p className="text-xs text-gray-400">{row.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {row.hasPhoto && <Camera size={12} className="text-ocean-400" />}
                  <span className="text-sm font-mono font-semibold text-gray-900">{row.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-gray-500 text-lg">Four focused features designed around how travelers actually think.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-sand-50 rounded-2xl p-6 card-hover stagger-child animate-slide-up">
                <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-ocean-600" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-ocean-600 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="font-display text-3xl font-bold text-white mb-4 relative">Ready to travel smarter?</h2>
          <p className="text-ocean-100 mb-8 relative">Free forever. No credit card needed.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-ocean-600 px-8 py-4 rounded-xl font-semibold hover:bg-sand-50 transition-colors relative"
          >
            Create your account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-sand-100 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} TravelBudget — Built with ♥ for travelers
        </p>
      </footer>
    </div>
  );
}
