# React + TypeScript + Vite

Para criar um CRUD em uma aplicação React utilizando TypeScript, Vite, e IndexedDB, siga os passos abaixo. Vou fornecer um exemplo básico para gerenciar uma lista de tarefas (to-do list).

### 1. Configuração do Projeto

Primeiro, crie um novo projeto com Vite:

```sh
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### 2. Instalação de Dependências

IndexedDB é uma API do navegador e não requer dependências adicionais, mas para facilitar a manipulação, podemos usar uma biblioteca como `idb`.

```sh
npm install idb
```

### 3. Estrutura do Projeto

Organize seu projeto da seguinte forma:

```
src/
├── components/
│   ├── AddTaskForm.tsx
│   ├── TaskList.tsx
├── db/
│   └── indexedDB.ts
├── App.tsx
├── main.tsx
```

### 4. Configuração do IndexedDB

Crie um arquivo para configurar o IndexedDB: `src/db/indexedDB.ts`

```typescript
import { openDB } from "idb";

const dbName = "tasksDB";
const storeName = "tasks";

export const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    },
  });
  return db;
};

export const getAllTasks = async () => {
  const db = await initDB();
  return await db.getAll(storeName);
};

export const addTask = async (task: { title: string }) => {
  const db = await initDB();
  return await db.add(storeName, task);
};

export const deleteTask = async (id: number) => {
  const db = await initDB();
  return await db.delete(storeName, id);
};
```

### 5. Componentes

Crie os componentes para adicionar e listar tarefas.

#### `src/components/AddTaskForm.tsx`

```typescript
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
```

#### `src/components/TaskList.tsx`

```typescript
import React from "react";
import { deleteTask } from "../db/indexedDB";

interface Task {
  id: number;
  title: string;
}

const TaskList: React.FC<{ tasks: Task[]; onTaskDeleted: () => void }> = ({
  tasks,
  onTaskDeleted,
}) => {
  const handleDelete = async (id: number) => {
    await deleteTask(id);
    onTaskDeleted();
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
```

### 6. Aplicação Principal

Configure a aplicação principal para gerenciar o estado das tarefas.

#### `src/App.tsx`

```typescript
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
      <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />
    </div>
  );
};

export default App;
```

### 7. Inicialização

Atualize o arquivo `src/main.tsx` para inicializar o aplicativo:

```typescript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 8. Estilos

Adicione estilos básicos em `src/index.css`:

```css
body {
  font-family: Arial, sans-serif;
}

form {
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  margin-right: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Conclusão

Com esses passos, você terá uma aplicação CRUD simples usando React, TypeScript, Vite e IndexedDB. Essa aplicação permite adicionar, listar e deletar tarefas, armazenando os dados no IndexedDB do navegador.

#

Entendi, vou adicionar a funcionalidade de edição de tarefas.

### 1. Atualização da Estrutura do Projeto

Modifique a estrutura do projeto para incluir a funcionalidade de edição:

```
src/
├── components/
│   ├── AddTaskForm.tsx
│   ├── TaskList.tsx
│   ├── EditTaskForm.tsx
├── db/
│   └── indexedDB.ts
├── App.tsx
├── main.tsx
```

### 2. Atualização do IndexedDB

Atualize o arquivo `src/db/indexedDB.ts` para incluir a funcionalidade de edição:

```typescript
import { openDB } from "idb";

const dbName = "tasksDB";
const storeName = "tasks";

export const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    },
  });
  return db;
};

export const getAllTasks = async () => {
  const db = await initDB();
  return await db.getAll(storeName);
};

export const addTask = async (task: { title: string }) => {
  const db = await initDB();
  return await db.add(storeName, task);
};

export const deleteTask = async (id: number) => {
  const db = await initDB();
  return await db.delete(storeName, id);
};

export const updateTask = async (task: { id: number; title: string }) => {
  const db = await initDB();
  return await db.put(storeName, task);
};
```

### 3. Componente de Edição

Crie um novo componente `EditTaskForm.tsx` para editar tarefas.

#### `src/components/EditTaskForm.tsx`

```typescript
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
```

### 4. Atualização do Componente de Lista de Tarefas

Atualize `TaskList.tsx` para incluir a funcionalidade de edição.

#### `src/components/TaskList.tsx`

```typescript
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
```

### 5. Atualização da Aplicação Principal

Atualize `App.tsx` para gerenciar o estado de edição.

#### `src/App.tsx`

```typescript
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
```

### 6. Inicialização

O arquivo `src/main.tsx` permanece o mesmo:

```typescript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7. Estilos

Adicione estilos básicos em `src/index.css` (sem alterações necessárias).

### Conclusão

Agora, você tem um aplicativo CRUD completo utilizando React, TypeScript, Vite e IndexedDB, que permite adicionar, listar, editar e deletar tarefas.

# Fim

# Inicio

Entendi, vamos adicionar a funcionalidade de pesquisa para filtrar as tarefas. Isso será feito adicionando uma barra de pesquisa e ajustando o componente de lista de tarefas para mostrar apenas as tarefas que correspondem ao termo de pesquisa.

### 1. Atualização do Componente de Pesquisa

Adicione um componente para a barra de pesquisa e ajuste `App.tsx` para gerenciar o estado da pesquisa.

#### `src/components/SearchBar.tsx`

```typescript
import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search tasks"
    />
  );
};

export default SearchBar;
```

### 2. Atualização do Componente de Lista de Tarefas

Ajuste `TaskList.tsx` para filtrar as tarefas com base no termo de pesquisa.

#### `src/components/TaskList.tsx`

```typescript
import React, { useState } from "react";
import { deleteTask } from "../db/indexedDB";
import EditTaskForm from "./EditTaskForm";

interface Task {
  id: number;
  title: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: () => void;
  onTaskUpdated: () => void;
  searchTerm: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskDeleted,
  onTaskUpdated,
  searchTerm,
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    onTaskDeleted();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filteredTasks.map((task) => (
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
```

### 3. Atualização da Aplicação Principal

Atualize `App.tsx` para incluir a barra de pesquisa e gerenciar o estado da pesquisa.

#### `src/App.tsx`

```typescript
import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import { getAllTasks } from "./db/indexedDB";

interface Task {
  id: number;
  title: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <AddTaskForm onTaskAdded={fetchTasks} />
      <TaskList
        tasks={tasks}
        onTaskDeleted={fetchTasks}
        onTaskUpdated={fetchTasks}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default App;
```

### 4. Atualização da Estrutura do Projeto

Certifique-se de que a estrutura do projeto está correta:

```
src/
├── components/
│   ├── AddTaskForm.tsx
│   ├── TaskList.tsx
│   ├── EditTaskForm.tsx
│   ├── SearchBar.tsx
├── db/
│   └── indexedDB.ts
├── App.tsx
├── main.tsx
```

### Conclusão

Com essas modificações, você adicionou a funcionalidade de pesquisa ao aplicativo, permitindo filtrar tarefas com base em um termo de pesquisa. Agora, a aplicação completa permite adicionar, listar, editar, deletar e pesquisar tarefas utilizando React, TypeScript, Vite e IndexedDB.

# Fim

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
