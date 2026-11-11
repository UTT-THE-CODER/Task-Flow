function getJwtConfig() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };
}

module.exports = { getJwtConfig };
