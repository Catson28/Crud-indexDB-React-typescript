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
