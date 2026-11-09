import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = req.headers?.authorization || req.headers?.Authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    // Read the secret at call time so it always reflects the current env.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "family-movie-watchlist-dev-secret",
    );
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
