// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");

// dotenv.config();

// // DB connect
// const connectDB = require("./config/db");
// connectDB();

// const app = express();

// //
// // ======================
// // 🔧 MIDDLEWARE
// // ======================
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //
// // ======================
// // 📂 STATIC FILES
// // ======================
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// //
// // ======================
// // 🚀 ROUTES
// // ======================
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/properties", require("./routes/propertyRoutes"));

// //
// // ======================
// // 🧪 TEST ROUTE
// // ======================
// app.get("/", (req, res) => {
//   res.send("Backend Running 🚀");
// });

// //
// // ======================
// // ❌ 404 HANDLER
// // ======================
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// //
// // ======================
// // 🔥 GLOBAL ERROR HANDLER (VERY IMPORTANT)
// // ======================
// app.use((err, req, res, next) => {
//   console.error("🔥 GLOBAL ERROR:", err);

//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// //
// // ======================
// // 🚀 SERVER START
// // ======================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// ======================
// DB CONNECT
// ======================
const connectDB = require("./config/db");
connectDB();

const app = express();

// ======================
// 🔥 CORS (PRODUCTION SAFE)
// ======================
app.use(
  cors({
    origin: "*", // allow all origins (fix mobile issue)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// IMPORTANT: handle preflight requests
app.options("*", cors());

// ======================
// 🔧 MIDDLEWARE
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// 📂 STATIC FILES
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// 🚀 ROUTES
// ======================
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// ======================
// 🧪 HEALTH CHECK (Render)
// ======================
app.get("/healthz", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy 🚀",
  });
});

// ======================
// 🧪 TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ======================
// ❌ 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================
// 🔥 GLOBAL ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================
// 🚀 SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});