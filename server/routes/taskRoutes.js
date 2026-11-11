const express = require("express");
const pool = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware); // every task route needs a logged-in user

// due_date is returned as dueDate because that is what the React frontend uses
const taskColumns = "id, title, description, due_date AS dueDate, priority, status";
const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

// Returns an error message if the task data is invalid, otherwise null
function checkTask(body) {
  if (!body.title || !body.title.trim()) return "Task title is required.";
  if (!priorities.includes(body.priority)) return "Priority must be Low, Medium or High.";
  if (!statuses.includes(body.status)) return "Status must be Pending, In Progress or Completed.";
  const dueDate = body.dueDate || body.due_date;
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return "Due date must look like 2026-11-04.";
  return null;
}

// GET /api/tasks/dashboard  (must stay above the /:id routes)
router.get("/dashboard", async (req, res) => {
  try {
    const [counts] = await pool.query(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(status = 'Pending'), 0) AS pending,
              COALESCE(SUM(status = 'In Progress'), 0) AS inProgress,
              COALESCE(SUM(status = 'Completed'), 0) AS completed,
              COALESCE(SUM(priority = 'High' AND status != 'Completed'), 0) AS highPriorityTotal
       FROM tasks WHERE user_id = ?`,
      [req.userId]
    );

    // Nearest due date first, tasks with no due date last
    const [highPriorityTasks] = await pool.query(
      `SELECT ${taskColumns} FROM tasks
       WHERE user_id = ? AND priority = 'High' AND status != 'Completed'
       ORDER BY due_date IS NULL, due_date ASC
       LIMIT 5`,
      [req.userId]
    );

    res.json({
      total: Number(counts[0].total),
      pending: Number(counts[0].pending),
      inProgress: Number(counts[0].inProgress),
      completed: Number(counts[0].completed),
      highPriorityTotal: Number(counts[0].highPriorityTotal),
      highPriorityTasks,
    });
  } catch (error) {
    console.log("Dashboard error:", error.message);
    res.status(500).json({ message: "Could not load the dashboard." });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const [tasks] = await pool.query(`SELECT ${taskColumns} FROM tasks WHERE user_id = ? ORDER BY id`, [req.userId]);
    res.json(tasks);
  } catch (error) {
    console.log("Get tasks error:", error.message);
    res.status(500).json({ message: "Could not load tasks." });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const errorMessage = checkTask(req.body);
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const { title, description, priority, status } = req.body;
    const dueDate = req.body.dueDate || req.body.due_date || null;

    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?)",
      [req.userId, title.trim(), description || "", dueDate, priority, status]
    );

    const [created] = await pool.query(`SELECT ${taskColumns} FROM tasks WHERE id = ?`, [result.insertId]);
    res.status(201).json(created[0]);
  } catch (error) {
    console.log("Create task error:", error.message);
    res.status(500).json({ message: "Could not create the task." });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const errorMessage = checkTask(req.body);
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const { title, description, priority, status } = req.body;
    const dueDate = req.body.dueDate || req.body.due_date || null;

    // "AND user_id = ?" makes sure users can only change their own tasks
    const [result] = await pool.query(
      "UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?",
      [title.trim(), description || "", dueDate, priority, status, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    const [updated] = await pool.query(`SELECT ${taskColumns} FROM tasks WHERE id = ?`, [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.log("Update task error:", error.message);
    res.status(500).json({ message: "Could not update the task." });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json({ message: "Task deleted." });
  } catch (error) {
    console.log("Delete task error:", error.message);
    res.status(500).json({ message: "Could not delete the task." });
  }
});

module.exports = router;
