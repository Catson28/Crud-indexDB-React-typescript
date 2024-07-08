import React, { useState } from "react";
import { deleteTask } from "../db/indexedDB";
import EditTaskForm from "./EditTaskForm";

interface Task {
  id: number;
  title: string;
}

const TaskList: React.FC<{
  tasks: Task[];
  onTaskDeleted: () => void;
  onTaskUpdated: () => void;
}> = ({ tasks, onTaskDeleted, onTaskUpdated }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    onTaskDeleted();
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {editingTask?.id === task.id ? (
            <EditTaskForm
              task={task}
              onTaskUpdated={onTaskUpdated}
              onCancel={() => setEditingTask(null)}
            />
          ) : (
            <>
              {task.title}
              <button onClick={() => setEditingTask(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
