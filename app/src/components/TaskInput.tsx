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
      <Button buttonColor="black" labelStyle={styles.button} mode="contained" onPress={() => { if (task.trim()) { onAdd(task); setTask(""); }}}>
        Add Task
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginBottom: 10, fontFamily: 'ndot47', fontWeight: 'normal', color: '#FFFFFF' },
  button: { fontFamily: 'ndot47', fontWeight: 'normal', color: '#FFFFFF' },
});

export default TaskInput;
