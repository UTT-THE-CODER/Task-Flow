const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  Promise.resolve()
    .then(() => pool.query("SELECT 1"))
    .then(() => {
      console.log("MySQL connected");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error("Could not connect to MySQL:", error.message);
      process.exit(1);
    });
}

module.exports = app;
