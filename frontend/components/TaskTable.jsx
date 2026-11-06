import { Flag, Pencil, Trash2, Check } from "lucide-react";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const statusClass = { Pending: "pending", "In Progress": "progress", Completed: "completed" };
export default function TaskTable({ tasks, onToggle, onEdit, onStatusChange, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th className="col-check"></th>
            <th>Task name</th>
            <th>Due date</th>
            <th>Priority</th>
            <th>Status</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const done = task.status === "Completed";
            return (
              <tr key={task.id} className={done ? "done" : ""}>
                <td>
                  <button className={done ? "checkbox checked" : "checkbox"} aria-label={done ? "Mark as pending" : "Mark as completed"} onClick={() => onToggle(task)}>
                    {done && <Check size={11} />}
                  </button>
                </td>
                <td className="task-title">{task.title}</td>
                <td className="muted">{formatDate(task.dueDate)}</td>
                <td><span className={"priority " + task.priority.toLowerCase()}><Flag size={11} /> {task.priority}</span></td>
                <td>
                  {onStatusChange ? (
                    <select className="status-select" aria-label="Change status" value={task.status} onChange={(e) => onStatusChange(task, e.target.value)}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  ) : (
                    <span className={"badge " + statusClass[task.status]}>{task.status}</span>
                  )}
                </td>
                <td className="actions">
                  <button aria-label="Edit task" onClick={() => onEdit(task)}><Pencil size={13} /></button>
                  {onDelete && <button aria-label="Delete task" onClick={() => onDelete(task)}><Trash2 size={13} /></button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
