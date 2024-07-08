import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import { getAllTasks } from "./db/indexedDB";

interface Task {
  id: number;
  title: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const allTasks = await getAllTasks();
    setTasks(allTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>To-Do List</h1>
      <AddTaskForm onTaskAdded={fetchTasks} />
      <TaskList
        tasks={tasks}
        onTaskDeleted={fetchTasks}
        onTaskUpdated={fetchTasks}
      />
    </div>
  );
};

export default App;
