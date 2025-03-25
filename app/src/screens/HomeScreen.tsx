import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import TaskItem from "../components/TaskItem";
import TaskInput from "../components/TaskInput";
import { initDatabase, getTasks, addTask, updateTask, toggleTask, deleteTask, Task } from "../database/db";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("pending");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'today', title: 'Today' },
    { key: 'yesterday', title: 'Yesterday' },
  ]);

  useEffect(() => {
    const loadDb = async () => {
      await initDatabase();
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
      setCurrentTasks(getTasksForToday(loadedTasks)); // Initialize currentTasks for today
    };
    loadDb();
  }, []);

  useEffect(() => {
    setTasks((prevTasks) => getFilteredTasks(prevTasks));
  }, [filter]);

  useEffect(() => {
    if (index === 0) {
      setCurrentTasks(getTasksForToday(tasks));
    } else if (index === 1) {
      setCurrentTasks(getTasksForYesterday(tasks));
    }
  }, [index, tasks]);

  const handleAddTask = async (text: string) => {
    const newTask = await addTask(text);
    if (newTask) {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      if (index === 0) {
        setCurrentTasks(getTasksForToday(updatedTasks)); // Update currentTasks for today
      } else if (index === 1) {
        setCurrentTasks(getTasksForYesterday(updatedTasks)); // Update currentTasks for yesterday
      }
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await toggleTask(id, completed);
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
    setTasks(updatedTasks);
    if (index === 0) {
      setCurrentTasks(getTasksForToday(updatedTasks)); // Update currentTasks for today
    } else if (index === 1) {
      setCurrentTasks(getTasksForYesterday(updatedTasks)); // Update currentTasks for yesterday
    }
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    if (index === 0) {
      setCurrentTasks(getTasksForToday(updatedTasks)); // Update currentTasks for today
    } else if (index === 1) {
      setCurrentTasks(getTasksForYesterday(updatedTasks)); // Update currentTasks for yesterday
    }
  };

  const handleEditTask = async () => {
    if (!editTask) return;
    await updateTask(editTask.id, editText);
    const updatedTasks = tasks.map((task) => (task.id === editTask.id ? { ...task, text: editText } : task));
    setTasks(updatedTasks);
    if (index === 0) {
      setCurrentTasks(getTasksForToday(updatedTasks)); // Update currentTasks for today
    } else if (index === 1) {
      setCurrentTasks(getTasksForYesterday(updatedTasks)); // Update currentTasks for yesterday
    }
    setVisible(false);
  };

  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter((task) => 
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    );
  };

  const getTasksForToday = (tasks: Task[]) => {
    const today = new Date().toDateString();
    var incompleteTasks = tasks.filter((task) => 
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    )
    return incompleteTasks.filter(task => new Date(task.date).toDateString() === today);
  };

  const getTasksForYesterday = (tasks: Task[]) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var incompleteTasks = tasks.filter((task) => 
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    )
    return incompleteTasks.filter(task => new Date(task.date).toDateString() === yesterday.toDateString());
  };

  const TodayRoute = () => (
    <FlatList
      data={currentTasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={handleToggleTask} onEdit={(task) => { setEditTask(task); setEditText(task.text); setVisible(true); }} onDelete={handleDeleteTask} />
      )}
    />
  );

  const YesterdayRoute = () => (
    <FlatList
      data={currentTasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={handleToggleTask} onEdit={(task) => { setEditTask(task); setEditText(task.text); setVisible(true); }} onDelete={handleDeleteTask} />
      )}
    />
  );

  const renderScene = SceneMap({
    today: TodayRoute,
    yesterday: YesterdayRoute,
  });

  return (
    <Provider>
      <View style={styles.container}>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 300}}
        pagerStyle={styles.tabbody}
        renderTabBar={props => <TabBar {...props} style={styles.tab}/>}
      />
      <TaskInput onAdd={handleAddTask} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, fontFamily: 'ndot47' },
  filterContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tabbody : { backgroundColor: '#000000', fontFamily: 'ndot47'},
  tab : { backgroundColor: '#252525', fontFamily: 'ndot47'}
});

export default HomeScreen;