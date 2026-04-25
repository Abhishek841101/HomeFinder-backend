const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🟢 REGISTER (Normal User)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "user", // default user
    });

    res.json({
      success: true,
      message: "User registered",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🟢 LOGIN (User + Admin both handle)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 🔥 HARDCODED ADMIN LOGIN
  if (email === "admin@gmail.com" && password === "123456") {
    const token = jwt.sign(
      { role: "admin" },
      "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        email: "admin@gmail.com",
        role: "admin",
      },
    });
  }

  // 👤 NORMAL USER LOGIN
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret123",
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user,
  });
};