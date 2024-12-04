import React, { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import "./styles.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
    }
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <TodoForm addTask={addTask} />
      <ul>
        {tasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            index={index}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
