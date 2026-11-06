import { useEffect, useState } from "react";
import { Calendar, Plus, Search } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskTable from "../components/TaskTable";
import TaskForm from "../components/TaskForm";
import ConfirmModal from "../components/ConfirmModal";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  async function loadTasks() {
    try {
      setTasks(await getTasks());
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not load your tasks. Check your connection and refresh."));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function changeStatus(task, status) {
    try {
      await updateTask(task.id, { ...task, status });
      await loadTasks();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not update the task. Please try again."));
    }
  }

  function toggleTask(task) {
    changeStatus(task, task.status === "Completed" ? "Pending" : "Completed");
  }

  async function saveTask(data) {
    if (editingTask) await updateTask(editingTask.id, data);
    else await createTask(data);
    setFormOpen(false);
    await loadTasks();
  }

  async function confirmDelete() {
    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      await loadTasks();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Could not delete the task. Please try again."));
    }
  }

  function openForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || t.status === statusFilter) &&
      (priorityFilter === "All" || t.priority === priorityFilter)
  );

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <DashboardLayout page="All Tasks" taskCount={tasks.length}>
      <div className="page-head">
        <div>
          <p className="date"><Calendar size={11} /> {today}</p>
          <h1>All Tasks</h1>
          <p className="muted">Everything you need to do, in one quiet space.</p>
        </div>
        <button className="btn-primary" onClick={() => openForm(null)}><Plus size={13} /> Add new task</button>
      </div>

      <div className="section-head">
        <div>
          <h2>Your task list <span className="count-pill">{tasks.length}</span></h2>
          <p className="muted small-text">Find your focus. Take it one task at a time.</p>
        </div>
      </div>

      <div className="filters">
        <div className="search">
          <Search size={13} />
          <input placeholder="Search tasks..." aria-label="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select aria-label="Filter by priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="panel">
        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <p>You have no tasks yet.</p>
            <button className="btn-primary" onClick={() => openForm(null)}><Plus size={13} /> Add task</button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="empty">No matching tasks</p>
        ) : (
          <TaskTable tasks={filteredTasks} onToggle={toggleTask} onEdit={openForm} onStatusChange={changeStatus} onDelete={setTaskToDelete} />
        )}
      </div>
      {tasks.length > 0 && <p className="muted small-text">{filteredTasks.length} of {tasks.length} tasks</p>}

      {formOpen && <TaskForm task={editingTask} onSave={saveTask} onClose={() => setFormOpen(false)} />}
      {taskToDelete && <ConfirmModal task={taskToDelete} onConfirm={confirmDelete} onCancel={() => setTaskToDelete(null)} />}
    </DashboardLayout>
  );
}
