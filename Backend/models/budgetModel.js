import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourName: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
      default: "",
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: Boolean,
      default: true,
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    coverPhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const budgetModel = mongoose.model("Budget", budgetSchema);
