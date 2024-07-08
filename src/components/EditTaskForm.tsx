import React, { useState } from "react";
import { updateTask } from "../db/indexedDB";

interface EditTaskFormProps {
  task: { id: number; title: string };
  onTaskUpdated: () => void;
  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  onTaskUpdated,
  onCancel,
}) => {
  const [title, setTitle] = useState(task.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await updateTask({ id: task.id, title });
      onTaskUpdated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Edit Task"
      />
      <button type="submit">Update Task</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditTaskForm;
