import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Checkbox, Card } from "react-native-paper";
import { Task } from "../database/db";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => (
  <Card mode="elevated" style={styles.card}>
    <Card.Content style={styles.content}>
      <Checkbox
        status={task.completed ? "checked" : "unchecked"}
        onPress={() => onToggle(task.id, task.completed)}
      />
      <Text style={[styles.text, styles.generalFont, task.completed && styles.completed]}>{task.text}</Text>
      <View style={styles.actions}>
        <Button icon="pencil" mode="text" onPress={() => onEdit(task)}></Button>
        <Button icon="delete" mode="text" onPress={() => onDelete(task.id)}></Button>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1, // Thin border
    borderColor: "#BB86FC", // Light purple border (adjust to theme)
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
    color: "#FFFFFF"
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  actions: {
    flexDirection: "row",
  },
  generalFont: {
    fontFamily: 'ndot47'
  }
});

export default TaskItem;
