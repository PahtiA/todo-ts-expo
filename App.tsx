import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('TASKS');
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading tasks', e);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
    } catch (e) {
      console.error('Error saving tasks', e);
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const newItem: Task = {
      id: Date.now().toString(),
      text: newTask,
      done: false,
    };

    const updated = [...tasks, newItem];
    setTasks(updated);
    saveTasks(updated);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <Text style={[styles.task, item.done && styles.done]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 20,
  marginTop: 50,
  backgroundColor: '#ffffff',   // ← lisää tämä
},

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  task: {
    fontSize: 20,
    paddingVertical: 8,
  },
  done: {
    textDecorationLine: 'line-through',
    color: 'white',
  },
});
