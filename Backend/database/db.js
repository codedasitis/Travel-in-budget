import { connect } from "mongoose";
import "dotenv/config";

const db = async () => {
  try {
    await connect(process.env.DATABASE_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export { db };
