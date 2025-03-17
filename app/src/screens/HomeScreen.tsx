import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Button, Dialog, Portal, Provider, Tab, TabView } from "react-native-paper";
import TaskItem from "../components/TaskItem";
import TaskInput from "../components/TaskInput";
import { initDatabase, getTasks, addTask, updateTask, toggleTask, deleteTask, Task } from "../database/db";

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Pending' },
    { key: 'completed', title: 'Completed' },
    { key: 'all', title: 'All' },
  ]);

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

  const getFilteredTasks = (tasks: Task[], filter: "all" | "completed" | "pending") => {
    return tasks.filter((task) => 
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'pending':
        return <TaskList tasks={getFilteredTasks(tasks, "pending")} onToggle={handleToggleTask} onEdit={setEditTask} onDelete={handleDeleteTask} />;
      case 'completed':
        return <TaskList tasks={getFilteredTasks(tasks, "completed")} onToggle={handleToggleTask} onEdit={setEditTask} onDelete={handleDeleteTask} />;
      case 'all':
        return <TaskList tasks={getFilteredTasks(tasks, "all")} onToggle={handleToggleTask} onEdit={setEditTask} onDelete={handleDeleteTask} />;
      default:
        return null;
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 300 }}
        />
        <TaskInput onAdd={handleAddTask} />
      </View>
    </Provider>
  );
};

const TaskList = ({ tasks, onToggle, onEdit, onDelete }) => (
  <FlatList
    data={tasks}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TaskItem task={item} onToggle={onToggle} onEdit={(task) => { onEdit(task); setEditText(task.text); setVisible(true); }} onDelete={onDelete} />
    )}
  />
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default HomeScreen;