import React, { useState } from "react";
import { addTask } from "../db/indexedDB";

const AddTaskForm: React.FC<{ onTaskAdded: () => void }> = ({
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addTask({ title });
      setTitle("");
      onTaskAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
