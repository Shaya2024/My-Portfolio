import React, { useState } from "react";
import TodoForm from "./components/ToDoForm";
import ToDoItem from "./components/ToDoItem";
import "./styles.css";

function App() {
  const [tasks, setTasks] = useState([]);

  function addTask(newTask) {
    setTasks([...tasks, {text: newTask, completed: false}]);
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    
  }


  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="app">
      <h1>To Do List</h1>
      <TodoForm addTask={addTask} />
      <ul>
        {tasks.map((task, index) => (
          <ToDoItem
            deleteTask={deleteTask}
            index={index}
            key={index}
            task={task}
            toggleComplete={toggleComplete}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
