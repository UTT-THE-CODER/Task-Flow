import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, List, Clock, RefreshCw, Check, Flag, ArrowRight } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/StatsCard";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";
import { getDashboard, createTask, updateTask } from "../services/api";

const emptyDashboard = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  highPriorityTotal: 0,
  highPriorityTasks: [],
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  async function loadDashboard() {
    try {
      setDashboard(await getDashboard());
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not load your dashboard. Check your connection and refresh."));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function toggleTask(task) {
    try {
      await updateTask(task.id, { ...task, status: task.status === "Completed" ? "Pending" : "Completed" });
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not update the task. Please try again."));
    }
  }

  async function saveTask(data) {
    if (editingTask) await updateTask(editingTask.id, data);
    else await createTask(data);
    setFormOpen(false);
    await loadDashboard();
  }

  function openForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const firstName = user?.name?.split(" ")[0];

  return (
    <DashboardLayout page="Dashboard" taskCount={dashboard.total}>
      <div className="page-head">
        <div>
          <p className="date"><Calendar size={11} /> {today}</p>
          <h1>{greeting}{firstName ? `, ${firstName}` : ""}.</h1>
          <p className="muted">A fresh day, a clear mind. Let’s focus on what matters.</p>
        </div>
        <button className="btn-primary" onClick={() => openForm(null)}><Plus size={13} /> Add new task</button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="stats">
        <StatsCard label="Total Tasks" count={dashboard.total} text="Everything in your space" icon={<List size={12} />} />
        <StatsCard label="Pending Tasks" count={dashboard.pending} text="Ready when you are" icon={<Clock size={12} />} />
        <StatsCard label="In Progress" count={dashboard.inProgress} text="One step at a time" icon={<RefreshCw size={12} />} />
        <StatsCard label="Completed" count={dashboard.completed} text="A little progress, every day" icon={<Check size={12} />} highlight />
      </div>

      <div className="section-head">
        <div>
          <h2><Flag size={13} /> Your priorities <span className="count-pill">{dashboard.highPriorityTotal}</span></h2>
          <p className="muted small-text">High-priority tasks that need your attention.</p>
        </div>
        <small className="muted">Nearest due date first</small>
      </div>

      <div className="panel">
        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : dashboard.highPriorityTasks.length === 0 ? (
          <p className="empty">No high-priority tasks right now.</p>
        ) : (
          <TaskTable tasks={dashboard.highPriorityTasks} onToggle={toggleTask} onEdit={openForm} />
        )}
        <Link className="view-all" to="/tasks">View all tasks <ArrowRight size={12} /></Link>
      </div>

      {formOpen && <TaskForm task={editingTask} onSave={saveTask} onClose={() => setFormOpen(false)} />}
    </DashboardLayout>
  );
}
