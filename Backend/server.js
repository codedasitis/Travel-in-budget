import express from "express";
import { userRouter } from "./routes/userRoutes.js";
import { db } from "./database/db.js";
import "dotenv/config";
import cors from "cors";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/user", userRouter);

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  db();
});
