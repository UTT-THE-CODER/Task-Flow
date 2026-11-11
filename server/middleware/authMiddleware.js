const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

module.exports = authMiddleware;
