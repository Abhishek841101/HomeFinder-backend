module.exports = function (req, res, next) {
  console.log("🔵 ISADMIN MIDDLEWARE HIT");

  console.log("USER IN ADMIN CHECK:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};