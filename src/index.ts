import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import favoriteRoutes from "./routes/favorites";
import advancedSearchRoutes from "./routes/advancedSearch";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "";

app.use(express.json());
app.use("/api/favorites", favoriteRoutes);
app.use("/api/search", advancedSearchRoutes);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
