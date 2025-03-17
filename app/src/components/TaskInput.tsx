import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface TaskInputProps {
  onAdd: (text: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [task, setTask] = useState("");

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={task}
        onChangeText={setTask}
      />
      <Button mode="contained" onPress={() => { if (task.trim()) { onAdd(task); setTask(""); }}}>
        Add Task
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginBottom: 10 },
});

export default TaskInput;
