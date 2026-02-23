import { Router } from "express";
import { signup, signin, forgotpassword, resetpassword } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/tokenValidationMiddleware.js";
import { upload } from "../middleware/cloudinary.js";
import {
  createTour,
  getAllTours,
  getActiveTour,
  setActiveTour,
  deleteTour,
  addExpense,
  deleteExpense,
  getTourWithExpenses,
  getDashboardData,
} from "../controllers/ExpenseBudgetController.js";

const userRouter = Router();

// ─── Public routes ────────────────────────────────────────────────────────────
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgot-password", forgotpassword);
userRouter.post("/reset-password", resetpassword);

// ─── Protected routes ─────────────────────────────────────────────────────────
userRouter.use(authenticateToken);

// Tours
userRouter.post("/tours", upload.single("coverPhoto"), createTour);
userRouter.get("/tours", getAllTours);
userRouter.get("/tours/active", getActiveTour);
userRouter.get("/tours/:tourId", getTourWithExpenses);
userRouter.patch("/tours/:tourId/activate", setActiveTour);
userRouter.delete("/tours/:tourId", deleteTour);

// Expenses
userRouter.post("/expenses", upload.array("photos", 5), addExpense);
userRouter.delete("/expenses/:expenseId", deleteExpense);

// Dashboard
userRouter.get("/dashboard", getDashboardData);

export { userRouter };
