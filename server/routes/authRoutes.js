const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { secret, expiresIn } = require("../config/jwt");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const emailPattern = /^\S+@\S+\.\S+$/;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "Account created. You can log in now." });
  } catch (error) {
    console.log("Register error:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    // Same message for unknown email and wrong password, so nobody can guess which emails exist
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [req.userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user: users[0] });
  } catch (error) {
    console.log("Me error:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
