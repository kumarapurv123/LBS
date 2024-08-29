import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/categories.js";
/* App Config */
dotenv.config();
const app = express();
const port = 4000;

/* Middlewares */
app.use(express.json());
app.use(cors());

/* MongoDB connection */
try {
  mongoose.connect("mongodb://127.0.0.1:27017/librery");
  const db = mongoose.connection;
  db.once("open", function () {
    console.log("Successfully connected to the database");
  });
} catch (error) {
  console.log(`Error : ${error.message}`.bgRed);
  process.exit(1);
}
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to LibraryApp");
});

/* Port Listening In */
app.listen(port, () => {
  console.log(`Server is running in PORT ${port}`);
});
