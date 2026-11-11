function getJwtConfig() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
      return require("./jwt");
    }

    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };
}

module.exports = { getJwtConfig };
