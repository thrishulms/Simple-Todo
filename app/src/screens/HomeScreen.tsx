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
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("pending");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'today', title: 'Today' },
    { key: 'yesterday', title: 'Yesterday' },
  ]);
  var defaultRoute = 'today';

  useEffect(() => {
    const loadDb = async () => {
      await initDatabase();
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    };
    loadDb();
  }, []);

  useEffect(() => {
    setTasks((prevTasks) => getFilteredTasks(prevTasks));
  }, [filter]);

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
      data={getTasksForToday(tasks)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={handleToggleTask} onEdit={(task) => { setEditTask(task); setEditText(task.text); setVisible(true); }} onDelete={handleDeleteTask} />
      )}
    />
  );
  
  const YesterdayRoute = () => (
    <FlatList
      data={getTasksForYesterday(tasks)}
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

        {/* <View style={styles.filterContainer}>
          <BouncyCheckbox
            size={25}
            fillColor="red"
            unFillColor="#FFFFFF"
            text="Pending"
            iconStyle={{ borderColor: "red" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: "ndot47" }}
            onPress={(isChecked: boolean) => { setFilter("pending") }}
          />
          <BouncyCheckbox
            size={25}
            fillColor="red"
            unFillColor="#FFFFFF"
            text="Completed"
            iconStyle={{ borderColor: "blue" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: "ndot47" }}
            onPress={(isChecked: boolean) => { setFilter("completed") }}
          />
          <BouncyCheckbox
            size={25}
            fillColor="red"
            unFillColor="#FFFFFF"
            text="All"
            iconStyle={{ borderColor: "white" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: "ndot47" }}
            onPress={(isChecked: boolean) => { console.log('all' + isChecked) }}
          />
        </View> */}
{/*         
        <FlatList
            data={getFilteredTasks(tasks)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskItem task={item} onToggle={handleToggleTask} onEdit={(task) => { setEditTask(task); setEditText(task.text); setVisible(true); }} onDelete={handleDeleteTask} />
            )}
          /> */}

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