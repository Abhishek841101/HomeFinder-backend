const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// DB connect
const connectDB = require("./config/db");
connectDB();

const app = express();

//
// ======================
// 🔧 MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
// ======================
// 📂 STATIC FILES
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//
// ======================
// 🚀 ROUTES
// ======================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));

//
// ======================
// 🧪 TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

//
// ======================
// ❌ 404 HANDLER
// ======================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//
// ======================
// 🔥 GLOBAL ERROR HANDLER (VERY IMPORTANT)
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//
// ======================
// 🚀 SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});