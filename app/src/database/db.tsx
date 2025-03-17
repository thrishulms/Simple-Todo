import { openDatabaseAsync } from "expo-sqlite";

let db;

export const initDatabase = async () => {
  db = await openDatabaseAsync("tasks.db");
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER, date TEXT);"
  );
};

export const getTasks = async () => {
  return db ? await db.getAllAsync("SELECT * FROM tasks;") : [];
};

export const addTask = async (text) => {
  if (!db) return null;
  const datetime = new Date().toISOString();
  const { lastInsertRowId } = await db.runAsync("INSERT INTO tasks (text, completed, datetime) VALUES (?, ?, ?);", [text, 0, datetime]);
  return { id: lastInsertRowId, text, completed: 0, datetime };
};

export const updateTask = async (id, text) => {
  if (!db) return;
  await db.runAsync("UPDATE tasks SET text = ? WHERE id = ?;", [text, id]);
};

export const toggleTask = async (id, completed) => {
  if (!db) return;
  await db.runAsync("UPDATE tasks SET completed = ? WHERE id = ?;", [completed ? 0 : 1, id]);
};

export const deleteTask = async (id) => {
  if (!db) return;
  await db.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
};