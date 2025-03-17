import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Checkbox, List } from "react-native-paper";
import { Task } from "../database/db";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => (
  <List.Item
    title={() => (
      <Text style={[styles.text, task.completed && styles.completed]}>{task.text}</Text>
    )}
    left={() => (
      <Checkbox
        status={task.completed ? "checked" : "unchecked"}
        onPress={() => onToggle(task.id, task.completed)}
      />
    )}
    right={() => (
      <View style={styles.actions}>
        <Button icon="pencil" mode="text" onPress={() => onEdit(task)}>Edit</Button>
        <Button icon="delete" mode="text" onPress={() => onDelete(task.id)}>Delete</Button>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  text: { fontSize: 16, fontFamily: 'ndot47' , color: 'white'},
  completed: { textDecorationLine: "line-through", color: "gray" },
  actions: { flexDirection: "row" },
});

export default TaskItem;
