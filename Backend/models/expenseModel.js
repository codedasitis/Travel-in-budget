import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, default: "" }, // e.g. "14:30"
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Accommodation",
        "Entertainment",
        "Shopping",
        "Health",
        "Education",
        "Others",
      ],
    },
    amount: { type: Number, required: true, min: 0 },
    photos: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const expenseModel = mongoose.model("Expense", expenseSchema);
