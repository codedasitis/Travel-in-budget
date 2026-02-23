import { budgetModel } from "../models/budgetModel.js";
import { expenseModel } from "../models/expenseModel.js";
import { cloudinary } from "../middleware/cloudinary.js"; // re-exported from cloudinary.js which handles v1 compat

// ─── TOUR (BUDGET) CONTROLLERS ────────────────────────────────────────────────

export const createTour = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { tourName, destination, numberOfDays, totalBudget, currency } = req.body;

    if (!tourName || !numberOfDays || !totalBudget) {
      return res.status(400).json({ message: "Tour name, days, and budget are required" });
    }

    // Deactivate any currently active tour
    await budgetModel.updateMany({ userId, status: true }, { status: false });

    const coverPhoto = req.file ? req.file.path : "";

    const tour = await budgetModel.create({
      userId,
      tourName,
      destination: destination || "",
      numberOfDays,
      totalBudget,
      currency: currency || "USD",
      status: true,
      coverPhoto,
    });

    res.status(201).json({ message: "Tour created successfully", tour });
  } catch (error) {
    console.error("Create tour error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const userId = req.user.id;
    const tours = await budgetModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate("expenses");

    res.status(200).json({ tours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const tour = await budgetModel
      .findOne({ userId, status: true })
      .populate("expenses");

    if (!tour) return res.status(404).json({ message: "No active tour found" });

    res.status(200).json({ tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setActiveTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tourId } = req.params;

    await budgetModel.updateMany({ userId }, { status: false });
    const tour = await budgetModel.findOneAndUpdate(
      { _id: tourId, userId },
      { status: true },
      { new: true }
    );

    if (!tour) return res.status(404).json({ message: "Tour not found" });

    res.status(200).json({ message: "Active tour switched", tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tourId } = req.params;

    const tour = await budgetModel.findOne({ _id: tourId, userId });
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    // Delete all expenses and their photos
    for (const expenseId of tour.expenses) {
      const expense = await expenseModel.findById(expenseId);
      if (expense?.photos?.length) {
        for (const photo of expense.photos) {
          if (photo.publicId) await cloudinary.uploader.destroy(photo.publicId);
        }
      }
      await expenseModel.findByIdAndDelete(expenseId);
    }

    // Delete cover photo
    if (tour.coverPhoto) {
      const parts = tour.coverPhoto.split("/");
      const publicId = `travel-budget-expenses/${parts[parts.length - 1].split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await budgetModel.findByIdAndDelete(tourId);

    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EXPENSE CONTROLLERS ──────────────────────────────────────────────────────

export const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, time, description, category, amount, notes } = req.body;

    if (!date || !description || !category || !amount) {
      return res.status(400).json({ message: "Date, description, category and amount are required" });
    }

    const tour = await budgetModel.findOne({ userId, status: true });
    if (!tour) return res.status(404).json({ message: "No active tour found. Please create or select a tour first." });

    // Handle uploaded photos
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        photos.push({ url: file.path, publicId: file.filename });
      }
    }

    const expense = await expenseModel.create({
      budgetId: tour._id,
      date,
      time: time || "",
      description,
      category,
      amount: parseFloat(amount),
      notes: notes || "",
      photos,
    });

    tour.expenses.push(expense._id);
    await tour.save();

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error("Add expense error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;

    const expense = await expenseModel.findById(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Verify ownership via budget
    const tour = await budgetModel.findOne({ _id: expense.budgetId, userId });
    if (!tour) return res.status(403).json({ message: "Unauthorized" });

    // Delete photos from Cloudinary
    if (expense.photos?.length) {
      for (const photo of expense.photos) {
        if (photo.publicId) {
          await cloudinary.uploader.destroy(photo.publicId).catch(() => {});
        }
      }
    }

    await expenseModel.findByIdAndDelete(expenseId);
    await budgetModel.updateOne({ _id: expense.budgetId }, { $pull: { expenses: expenseId } });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTourWithExpenses = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await budgetModel.findById(tourId).populate("expenses");
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json({ tour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const tour = await budgetModel
      .findOne({ userId, status: true })
      .populate("expenses");

    if (!tour) {
      return res.status(404).json({ message: "No active tour found" });
    }

    const totalBudget = tour.totalBudget;
    const numberOfDays = tour.numberOfDays;

    const totalExpenses = tour.expenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingBudget = totalBudget - totalExpenses;
    const dailyAvgSpent = numberOfDays > 0 ? totalExpenses / numberOfDays : 0;

    // Category breakdown
    const categoryBreakdown = {};
    tour.expenses.forEach((e) => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
    });

    res.status(200).json({
      tour: {
        id: tour._id,
        tourName: tour.tourName,
        destination: tour.destination,
        numberOfDays: tour.numberOfDays,
        currency: tour.currency,
        coverPhoto: tour.coverPhoto,
      },
      totalBudget,
      totalExpenses,
      remainingBudget,
      dailyAvgSpent,
      categoryBreakdown,
      expenses: tour.expenses,
    });
  } catch (error) {
    console.error("Dashboard data error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
