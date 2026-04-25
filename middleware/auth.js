// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, "secret123");
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };


const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("🟡 AUTH MIDDLEWARE HIT");

  let token = req.headers.authorization;

  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, "secret123");

    console.log("✅ USER DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("❌ AUTH ERROR:", err.message);

    return res.status(401).json({ message: "Invalid token" });
  }
};