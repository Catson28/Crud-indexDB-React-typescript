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

# Inicio do sevice worker

No contexto do desenvolvimento de aplicações web, especialmente Progressive Web Apps (PWAs), o Service Worker é um script que o navegador executa em segundo plano, separado da página da web. Os artefatos criados e gerenciados pelo Service Worker incluem:

1. **Cache Storage**:

   - **Precaching**: Arquivos que são armazenados em cache quando o Service Worker é instalado. Isso inclui arquivos essenciais como HTML, CSS, JavaScript, imagens, fontes e outros recursos necessários para que o site funcione offline.
   - **Runtime Caching**: Recursos que são armazenados em cache dinamicamente durante a execução do Service Worker, geralmente em resposta a requisições de rede.

2. **Fetch Events**:

   - Interceptação e manipulação de requisições de rede. O Service Worker pode responder a estas requisições com arquivos em cache, novos arquivos da rede ou uma combinação de ambos.

3. **Sync Events**:

   - Sincronização em segundo plano. Permite que ações sejam completadas quando o dispositivo volta a ter conexão, como enviar dados para um servidor.

4. **Push Notifications**:

   - Gerenciamento de notificações push. O Service Worker pode ouvir eventos de push e exibir notificações para o usuário, mesmo quando o aplicativo não está aberto.

5. **Message Events**:
   - Comunicação entre a página da web e o Service Worker através de mensagens.

### Exemplos de Artefatos no Código

- **Cache Storage**:

  ```javascript
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("v1").then((cache) => {
        return cache.addAll([
          "/index.html",
          "/styles.css",
          "/script.js",
          "/image.png",
        ]);
      })
    );
  });
  ```

- **Fetch Events**:

  ```javascript
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  ```

- **Sync Events**:

  ```javascript
  self.addEventListener("sync", (event) => {
    if (event.tag === "sync-tag") {
      event
        .waitUntil
        // lógica para sincronizar dados
        ();
    }
  });
  ```

- **Push Notifications**:

  ```javascript
  self.addEventListener("push", (event) => {
    const options = {
      body: event.data.text(),
      icon: "/icon.png",
    };
    event.waitUntil(
      self.registration.showNotification("Push Notification", options)
    );
  });
  ```

- **Message Events**:
  ```javascript
  self.addEventListener("message", (event) => {
    // lógica para tratar mensagens recebidas
  });
  ```

Estes são alguns dos principais artefatos e eventos associados ao Service Worker. Eles permitem que as aplicações web funcionem de maneira mais eficiente e confiável, mesmo em condições de conectividade instável ou inexistente.

Sim, você está correto. O conjunto de operações de criar, ler, atualizar e deletar é comumente chamado de **CRUD** (Create, Read, Update, Delete).

Quando se fala sobre as operações de um Service Worker, elas geralmente envolvem:

1. **Instalação (Install)**: Carregar e cachear recursos necessários.
2. **Ativação (Activate)**: Limpar caches antigos e configurar o Service Worker para estar pronto para controle.
3. **Busca (Fetch)**: Interceptar e responder a requisições de rede.
4. **Sincronização (Sync)**: Sincronizar dados em segundo plano.
5. **Push Notifications**: Gerenciar notificações push.
6. **Mensagens (Message)**: Comunicação entre a página web e o Service Worker.

Estas operações não têm um acrônimo tão consolidado quanto CRUD, mas podemos agrupar essas operações sob o termo **"Gerenciamento de Service Worker"** ou **"Ciclo de Vida do Service Worker"**.

Se tivéssemos que criar um acrônimo para estas operações, poderia ser algo como **IFAPSM** (Install, Fetch, Activate, Push, Sync, Message), mas não é uma prática comum e aceita na comunidade de desenvolvedores. Normalmente, referimo-nos a estas operações como parte do ciclo de vida ou do gerenciamento de um Service Worker.

# fim do service worker

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

# Service Worker

Vamos criar um aplicativo React com TypeScript usando Vite e adicionar um Service Worker para demonstrar todas as operações mencionadas. Vou orientar você passo a passo para configurar o projeto e adicionar as funcionalidades do Service Worker.

### Passo 1: Configurar o Projeto com Vite

1. **Criar um novo projeto com Vite**:

   ```sh
   npm create vite@latest my-react-app --template react-ts
   cd my-react-app
   npm install
   ```

2. **Instalar dependências adicionais**:
   ```sh
   npm install workbox-webpack-plugin
   ```

### Passo 2: Configurar o Service Worker

1. **Criar o arquivo `service-worker.ts`** no diretório `src`:

   ```typescript
   self.addEventListener("install", (event) => {
     console.log("Service Worker installing.");
     // Precache resources
     event.waitUntil(
       caches.open("v1").then((cache) => {
         return cache.addAll([
           "/",
           "/index.html",
           "/src/main.tsx",
           "/src/App.tsx",
           "/src/style.css",
         ]);
       })
     );
   });

   self.addEventListener("activate", (event) => {
     console.log("Service Worker activating.");
     // Clear old caches
     event.waitUntil(
       caches.keys().then((cacheNames) => {
         return Promise.all(
           cacheNames.map((cache) => {
             if (cache !== "v1") {
               return caches.delete(cache);
             }
           })
         );
       })
     );
   });

   self.addEventListener("fetch", (event) => {
     event.respondWith(
       caches.match(event.request).then((response) => {
         return response || fetch(event.request);
       })
     );
   });

   self.addEventListener("sync", (event) => {
     if (event.tag === "sync-tag") {
       event.waitUntil(
         // Lógica para sincronizar dados
         Promise.resolve(console.log("Sync event fired"))
       );
     }
   });

   self.addEventListener("push", (event) => {
     const options = {
       body: event.data ? event.data.text() : "Push message no payload",
       icon: "/icon.png",
     };
     event.waitUntil(
       self.registration.showNotification("Push Notification", options)
     );
   });

   self.addEventListener("message", (event) => {
     console.log("Message received: ", event.data);
   });
   ```

2. **Registrar o Service Worker** no `main.tsx`:

   ```typescript
   import React from "react";
   import ReactDOM from "react-dom";
   import App from "./App";
   import "./style.css";

   if ("serviceWorker" in navigator) {
     window.addEventListener("load", () => {
       navigator.serviceWorker
         .register("/service-worker.js")
         .then((registration) => {
           console.log("SW registered: ", registration);
         })
         .catch((registrationError) => {
           console.log("SW registration failed: ", registrationError);
         });
     });
   }

   ReactDOM.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
     document.getElementById("root")
   );
   ```

### Passo 3: Configurar o Workbox para Build

1. **Instalar o Workbox CLI**:

   ```sh
   npm install workbox-cli --global
   ```

2. **Criar um arquivo `workbox-config.js` na raiz do projeto**:

   ```javascript
   module.exports = {
     globDirectory: "dist/",
     globPatterns: ["**/*.{html,js,css,png}"],
     swSrc: "src/service-worker.ts",
     swDest: "dist/service-worker.js",
     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
   };
   ```

3. **Adicionar scripts no `package.json`**:
   ```json
   "scripts": {
       "build": "vite build && workbox generateSW workbox-config.js"
   }
   ```

### Passo 4: Implementar a Interface Simples

1. **Editar `App.tsx`** para incluir uma interface básica:

   ```tsx
   import React, { useEffect } from "react";

   function App() {
     useEffect(() => {
       if ("serviceWorker" in navigator && "SyncManager" in window) {
         navigator.serviceWorker.ready.then((swRegistration) => {
           return swRegistration.sync.register("sync-tag");
         });
       }
     }, []);

     const sendMessage = () => {
       if (navigator.serviceWorker.controller) {
         navigator.serviceWorker.controller.postMessage("Hello from App");
       }
     };

     return (
       <div>
         <h1>Service Worker Demo</h1>
         <button onClick={sendMessage}>Send Message to SW</button>
       </div>
     );
   }

   export default App;
   ```

### Passo 5: Build e Teste

1. **Build o projeto**:

   ```sh
   npm run build
   ```

2. **Servir os arquivos estáticos para testar**:
   ```sh
   npx serve dist
   ```

### Resumo

Este projeto configura um aplicativo React com TypeScript usando Vite e integra um Service Worker para realizar operações de instalação, ativação, cache, sincronização em segundo plano, notificações push e mensagens entre a página web e o Service Worker. Isso fornece uma base sólida para desenvolver uma Progressive Web App completa.
