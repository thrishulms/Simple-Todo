import React, { useEffect, useState } from "react";
import { View, FlatList, TextInput, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Provider, Menu } from "react-native-paper";
import TaskItem from "../components/TaskItem";
import TaskInput from "../components/TaskInput";
import { initDatabase, getTasks, addTask, updateTask, toggleTask, deleteTask, Task } from "../database/db";

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [visible, setVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("pending");

  useEffect(() => {
    const loadDb = async () => {
      await initDatabase();
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    };
    loadDb();
  }, []);

  const handleAddTask = async (text: string) => {
    const newTask = await addTask(text);
    if (newTask) setTasks([...tasks, newTask]);
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await toggleTask(id, completed);
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = async () => {
    if (!editTask) return;
    await updateTask(editTask.id, editText);
    setTasks(tasks.map((task) => (task.id === editTask.id ? { ...task, text: editText } : task)));
    setVisible(false);
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => 
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    );
  };

  return (
    <Provider>
        <View style={styles.container}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<Button mode="contained" onPress={() => setMenuVisible(true)}>Sort</Button>}
          >
            <Menu.Item onPress={() => setFilter("pending")} title="Pending Tasks" />
            <Menu.Item onPress={() => setFilter("completed")} title="Completed Tasks" />
            <Menu.Item onPress={() => setFilter("all")} title="All Tasks" />
          </Menu>

          <FlatList
            data={getFilteredTasks()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskItem task={item} onToggle={handleToggleTask} onEdit={(task) => { setEditTask(task); setEditText(task.text); setVisible(true); }} onDelete={handleDeleteTask} />
            )}
          />

          <TaskInput onAdd={handleAddTask} />
        </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2, padding: 20 },
});

export default HomeScreen;
