const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const { secret } = require("./config/jwt");

if (secret === "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET") {
  console.log("Set your own secret in config/jwt.js before starting the server.");
  process.exit(1);
}

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // the Vite frontend
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = 5000;

// Check the database first, then start listening
pool
  .query("SELECT 1")
  .then(() => {
    console.log("MySQL connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.log("Could not connect to MySQL:", error.code);
    process.exit(1);
  });
