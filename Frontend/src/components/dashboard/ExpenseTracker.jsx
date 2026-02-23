import { useState, useRef } from "react";
import { PlusCircle, Trash2, Camera, X, Upload, MapPin, AlertCircle } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../utils/api";

const CATEGORY_EMOJI = {
  Food: "🍛", Transport: "🚗", Accommodation: "🏨",
  Entertainment: "🎭", Shopping: "🛍️", Health: "💊",
  Education: "📚", Others: "💸",
};

const CATEGORIES = Object.keys(CATEGORY_EMOJI);
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", AED: "د.إ" };

function PhotoPreview({ file, url, onRemove }) {
  const src = file ? URL.createObjectURL(file) : url;
  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-sand-200 group">
      <img src={src} alt="expense" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} className="text-white" />
      </button>
    </div>
  );
}

function AddExpenseModal({ onClose, onSuccess, currency }) {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    category: "Food",
    amount: "",
    notes: "",
  });
  const [photos, setPhotos] = useState([]); // Array of File objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      photos.forEach((photo) => formData.append("photos", photo));

      await api.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-100">
          <h2 className="font-display text-xl font-semibold text-gray-900">Add Expense</h2>
          <button onClick={onClose} className="p-2 hover:bg-sand-50 rounded-lg transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Dinner at local restaurant"
              className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
            />
          </div>

          {/* Amount + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount ({sym}) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm font-mono focus:border-ocean-400 transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any extra details..."
              rows={2}
              className="w-full px-4 py-2.5 border border-sand-200 rounded-xl text-sm focus:border-ocean-400 transition-colors bg-white resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos <span className="text-gray-400 font-normal">(up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {photos.map((file, i) => (
                <PhotoPreview key={i} file={file} onRemove={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))} />
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-sand-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-ocean-400 hover:bg-ocean-50 transition-colors text-gray-400 hover:text-ocean-500"
                >
                  <Camera size={18} />
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-sand-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-sand-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-ocean-600 text-white rounded-xl text-sm font-medium hover:bg-ocean-700 disabled:opacity-60 transition-colors">
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpenseCard({ expense, currency, onDelete }) {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  const [showPhotos, setShowPhotos] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this expense?")) return;
    setDeleting(true);
    try {
      await api.delete(`/expenses/${expense._id}`);
      onDelete(expense._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-sand-100 rounded-2xl p-4 card-hover animate-slide-up stagger-child">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 flex-shrink-0">{CATEGORY_EMOJI[expense.category] || "💸"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900 leading-snug">{expense.description}</p>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="text-xs text-gray-400">
                  {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {expense.time && ` · ${expense.time}`}
                </span>
                <span className="text-xs bg-sand-100 text-sand-700 px-2 py-0.5 rounded-full">{expense.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg font-mono font-bold text-gray-900">{sym}{Number(expense.amount).toLocaleString()}</span>
              <button onClick={handleDelete} disabled={deleting} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {expense.notes && <p className="text-xs text-gray-500 mt-1 italic">"{expense.notes}"</p>}

          {expense.photos?.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowPhotos(!showPhotos)}
                className="flex items-center gap-1 text-xs text-ocean-500 hover:text-ocean-700"
              >
                <Camera size={12} /> {expense.photos.length} photo{expense.photos.length > 1 ? "s" : ""}
              </button>
              {showPhotos && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {expense.photos.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noreferrer">
                      <img src={p.url} alt={`expense-${i}`} className="w-16 h-16 object-cover rounded-lg border border-sand-100 hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExpenseTracker() {
  const { dashboardData, refresh } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [expenses, setExpenses] = useState([]);

  const currency = dashboardData?.tour?.currency || "USD";
  const sym = CURRENCY_SYMBOLS[currency] || "$";

  // Sync expenses from dashboardData
  const rawExpenses = dashboardData?.expenses || [];
  const sorted = [...rawExpenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filtered = filterCat === "All" ? sorted : sorted.filter((e) => e.category === filterCat);

  const handleSuccess = async () => {
    setShowModal(false);
    await refresh();
  };

  const handleDelete = async (id) => {
    await refresh();
  };

  if (!dashboardData) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <MapPin size={32} className="text-sand-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">No active tour</h2>
        <p className="text-gray-500 mb-6">Create or activate a tour to start adding expenses.</p>
        <a href="/dashboard/tours" className="inline-flex items-center gap-2 bg-ocean-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-ocean-700 transition-colors">
          Go to Tours
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-400 mt-0.5">{dashboardData.tour.tourName}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-ocean-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-ocean-700 transition-colors shadow-sm shadow-ocean-200"
        >
          <PlusCircle size={16} /> Add Expense
        </button>
      </div>

      {/* Summary bar */}
      <div className="bg-white border border-sand-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="text-center">
          <p className="font-mono font-bold text-lg text-gray-900">{sym}{Number(dashboardData.totalExpenses || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400">Total Spent</p>
        </div>
        <div className="h-10 w-px bg-sand-100" />
        <div className="text-center">
          <p className={`font-mono font-bold text-lg ${(dashboardData.remainingBudget || 0) < 0 ? "text-red-500" : "text-green-600"}`}>
            {sym}{Math.abs(dashboardData.remainingBudget || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">{(dashboardData.remainingBudget || 0) < 0 ? "Over budget!" : "Remaining"}</p>
        </div>
        <div className="h-10 w-px bg-sand-100" />
        <div className="text-center">
          <p className="font-mono font-bold text-lg text-gray-900">{rawExpenses.length}</p>
          <p className="text-xs text-gray-400">Transactions</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCat === cat ? "bg-ocean-600 text-white" : "bg-white border border-sand-200 text-gray-600 hover:border-ocean-300"
            }`}
          >
            {cat !== "All" && CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🧾</p>
          <p className="font-medium">No expenses {filterCat !== "All" ? `in "${filterCat}"` : "yet"}</p>
          <button onClick={() => setShowModal(true)} className="mt-3 text-ocean-600 hover:underline text-sm">Add your first expense →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((exp) => (
            <ExpenseCard key={exp._id} expense={exp} currency={currency} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          currency={currency}
        />
      )}
    </div>
  );
}
