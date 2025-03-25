import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

interface TaskInputProps {
  onAdd: (text: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [task, setTask] = useState("");

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={task}
        onChangeText={setTask}
        placeholderTextColor="#888"
      />
      <IconButton
        icon="plus"
        color="white"
        size={24}
        onPress={() => {
          if (task.trim()) {
            onAdd(task);
            setTask("");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: 'ndot47',
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
});

export default TaskInput;