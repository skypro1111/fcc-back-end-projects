import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findByUsername } from "../utils/db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "family-movie-watchlist-dev-secret",
    { expiresIn: "1h" },
  );

  res.status(200).json({ token });
});

export default router;
