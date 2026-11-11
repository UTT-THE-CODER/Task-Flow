const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const { secret } = require("./config/jwt");

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = 5000;

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
