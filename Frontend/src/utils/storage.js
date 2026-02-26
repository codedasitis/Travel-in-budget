// All data is stored in localStorage under these keys:
// tb_tours: array of tour objects
// tb_expenses: array of expense objects

const TOURS_KEY = "tb_tours";
const EXPENSES_KEY = "tb_expenses";

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── TOURS ────────────────────────────────────────────────────────────────────

export function getTours() {
  return JSON.parse(localStorage.getItem(TOURS_KEY) || "[]");
}

export function saveTours(tours) {
  localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
}

export function createTour(data) {
  const tours = getTours();
  // Deactivate all others
  tours.forEach((t) => (t.active = false));
  const tour = { ...data, id: generateId(), active: true, createdAt: new Date().toISOString() };
  tours.unshift(tour);
  saveTours(tours);
  return tour;
}

export function getActiveTour() {
  return getTours().find((t) => t.active) || null;
}

export function setActiveTour(id) {
  const tours = getTours();
  tours.forEach((t) => (t.active = t.id === id));
  saveTours(tours);
}

export function deleteTour(id) {
  const tours = getTours().filter((t) => t.id !== id);
  // If deleted tour was active, activate the first remaining
  if (tours.length > 0 && !tours.find((t) => t.active)) {
    tours[0].active = true;
  }
  saveTours(tours);
  // Also delete all expenses for this tour
  const expenses = getExpenses().filter((e) => e.tourId !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

export function getExpenses(tourId = null) {
  const all = JSON.parse(localStorage.getItem(EXPENSES_KEY) || "[]");
  return tourId ? all.filter((e) => e.tourId === tourId) : all;
}

export function addExpense(data) {
  const expenses = getExpenses();
  const expense = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  expenses.unshift(expense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expense;
}

export function deleteExpense(id) {
  const expenses = getExpenses().filter((e) => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

// ─── PHOTO HELPERS ────────────────────────────────────────────────────────────

// Convert File to base64 for localStorage storage
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
