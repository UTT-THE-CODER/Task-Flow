import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyTask = { title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" };

export default function TaskForm({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || emptyTask);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Task title is required.");
    setSaving(true);
    try {
      await onSave({ ...form, title: form.title.trim() });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save the task. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <div className="modal-head">
          <h2>{task ? "Edit task" : "Add new task"}</h2>
          <button type="button" aria-label="Close" onClick={onClose}><X size={16} /></button>
        </div>

        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} autoFocus />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} />

        <div className="modal-row">
          <div>
            <label htmlFor="dueDate">Due date</label>
            <input id="dueDate" name="dueDate" type="date" value={form.dueDate || ""} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save task"}</button>
        </div>
      </form>
    </div>
  );
}
