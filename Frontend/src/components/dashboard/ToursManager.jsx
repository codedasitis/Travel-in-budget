import { useState, useRef, useEffect } from "react";
import { PlusCircle, X, MapPin, Calendar, Wallet, Check, Trash2, Camera, Globe } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../utils/api";

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED", "SGD", "AUD", "CAD"];
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", AED: "د.إ", SGD: "S$", AUD: "A$", CAD: "C$" };

function CreateTourModal({ onClose, onSuccess }) {
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    tourName: "",
    destination: "",
    numberOfDays: "",
    totalBudget: "",
    currency: "INR",
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      await api.post("/tours", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-100">
          <h2 className="font-display text-xl font-semibold text-gray-900">Create New Tour</h2>
          <button onClick={onClose} className="p-2 hover:bg-sand-50 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

          {/* Cover photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo <span className="text-gray-400 font-normal">(optional)</span></label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-36 rounded-xl border-2 border-dashed border-sand-300 hover:border-ocean-400 cursor-pointer transition-colors overflow-hidden bg-sand-50 hover:bg-ocean-50 flex items-center justify-center"
            >
              {coverPhoto ? (
                <>
                  <img src={URL.createObjectURL(coverPhoto)} alt="cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">Change photo</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <Camera size={28} className="mx-auto mb-1" />
                  <p className="text-sm">Click to add cover photo</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && setCoverPhoto(e.target.files[0])} />
          </div>

          {/* Tour name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tour Name *</label>
            <input
              type="text"
              required
              value={form.tourName}
              onChange={(e) => setForm({ ...form, tourName: e.target.value })}
              placeholder="e.g. Rajasthan Road Trip 2025"
              className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="e.g. Jaipur, Jodhpur, Jaisalmer"
                className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
              />
            </div>
          </div>

          {/* Days + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Days *</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={form.numberOfDays}
                  onChange={(e) => setForm({ ...form, numberOfDays: e.target.value })}
                  placeholder="7"
                  className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c} ({CURRENCY_SYMBOLS[c]})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Total budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Total Budget ({CURRENCY_SYMBOLS[form.currency]}) *
            </label>
            <div className="relative">
              <Wallet size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
                placeholder="50000"
                className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-xl text-sm font-mono focus:border-ocean-400 transition-colors bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-sand-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-sand-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-ocean-600 text-white rounded-xl text-sm font-medium hover:bg-ocean-700 disabled:opacity-60 transition-colors">
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TourCard({ tour, isActive, onActivate, onDelete }) {
  const sym = CURRENCY_SYMBOLS[tour.currency] || "$";
  const totalSpent = tour.expenses?.reduce((acc, e) => acc + (e.amount || 0), 0) || 0;
  const pct = Math.min(100, Math.round((totalSpent / tour.totalBudget) * 100));
  const [deleting, setDeleting] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await api.patch(`/tours/${tour._id}/activate`);
      onActivate();
    } catch (err) {
      alert("Failed to switch tour");
    } finally {
      setActivating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${tour.tourName}" and all its expenses? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/tours/${tour._id}`);
      onDelete();
    } catch (err) {
      alert("Failed to delete tour");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`bg-white border-2 rounded-2xl overflow-hidden card-hover animate-slide-up stagger-child ${isActive ? "border-ocean-400" : "border-sand-100"}`}>
      {/* Cover */}
      <div className="relative h-28 bg-gradient-to-r from-ocean-600 to-ocean-400">
        {tour.coverPhoto && <img src={tour.coverPhoto} alt={tour.tourName} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {isActive && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <Check size={10} /> Active
          </div>
        )}
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-display font-semibold">{tour.tourName}</p>
          {tour.destination && <p className="text-white/70 text-xs flex items-center gap-1"><MapPin size={10} />{tour.destination}</p>}
        </div>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <p className="text-xs text-gray-400">Budget</p>
            <p className="font-mono font-bold text-gray-900">{sym}{Number(tour.totalBudget).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Spent</p>
            <p className="font-mono font-bold text-coral-500">{sym}{Number(totalSpent).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{tour.numberOfDays} days</p>
            <p className="text-xs text-gray-500">{tour.expenses?.length || 0} expenses</p>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full ${pct > 80 ? "bg-red-400" : "bg-ocean-400"}`} style={{ width: `${pct}%` }} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isActive && (
            <button onClick={handleActivate} disabled={activating} className="flex-1 py-2 bg-ocean-600 text-white rounded-xl text-xs font-medium hover:bg-ocean-700 transition-colors disabled:opacity-60">
              {activating ? "Switching..." : "Set Active"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors disabled:opacity-60 ${isActive ? "flex-1 border-red-200 text-red-500 hover:bg-red-50" : "border-sand-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"}`}
          >
            <Trash2 size={14} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToursManager() {
  const { allTours, dashboardData, fetchAllTours, refresh } = useDashboard();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllTours();
  }, []);

  const activeTourId = dashboardData?.tour?.id;

  const handleSuccess = async () => {
    setShowModal(false);
    await refresh();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Tours</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allTours.length} tour{allTours.length !== 1 ? "s" : ""} created</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-ocean-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-ocean-700 transition-colors shadow-sm shadow-ocean-200"
        >
          <PlusCircle size={16} /> New Tour
        </button>
      </div>

      {/* Info note */}
      <div className="bg-ocean-50 border border-ocean-100 rounded-xl px-4 py-3 text-sm text-ocean-700 flex items-start gap-2">
        <MapPin size={15} className="flex-shrink-0 mt-0.5" />
        <span>Only one tour can be <strong>active</strong> at a time. Switch between tours anytime — all data is saved.</span>
      </div>

      {/* Tours grid */}
      {allTours.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🗺️</p>
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No tours yet</h3>
          <p className="text-gray-500 mb-6">Create your first tour to start tracking expenses.</p>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-ocean-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-ocean-700 transition-colors">
            <PlusCircle size={18} /> Create Your First Tour
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTours.map((tour) => (
            <TourCard
              key={tour._id}
              tour={tour}
              isActive={tour._id === activeTourId || tour.status === true}
              onActivate={refresh}
              onDelete={refresh}
            />
          ))}
        </div>
      )}

      {showModal && <CreateTourModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </div>
  );
}
