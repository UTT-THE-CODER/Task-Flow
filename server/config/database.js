const mysql = require("mysql2/promise");

let pool;

function getPool() {
  if (!pool) {
    const requiredVariables = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

    if (
      !requiredVariables.some((name) => process.env[name]) &&
      !process.env.VERCEL &&
      process.env.NODE_ENV !== "production"
    ) {
      pool = require("./db");
      return pool;
    }

    const missingVariables = requiredVariables.filter((name) => !process.env[name]);

    if (missingVariables.length > 0) {
      throw new Error(`Missing database environment variables: ${missingVariables.join(", ")}`);
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dateStrings: true,
    });
  }

  return pool;
}

module.exports = {
  query(...args) {
    return getPool().query(...args);
  },
};
