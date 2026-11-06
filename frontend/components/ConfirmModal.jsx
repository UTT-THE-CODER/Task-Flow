import { useEffect } from "react";

export default function ConfirmModal({ task, onConfirm, onCancel }) {
  useEffect(() => {
    const closeOnEscape = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal small" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>Delete task?</h2>
        <p className="muted">“{task.title}” will be permanently deleted.</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Confirm delete</button>
        </div>
      </div>
    </div>
  );
}
