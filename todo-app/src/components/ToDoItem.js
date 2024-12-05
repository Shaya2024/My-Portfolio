import React from "react";

function TodoItem({ toggleComplete, deleteTask, task, index,}) {
 
  return (
 <li className={`todo-item ${task.completed ? "completed" : ""}`}>
    <span onClick={()=>toggleComplete(index)}>{task.text}</span>
    <button onClick={() => deleteTask(index)}>Delete</button></li>
  )
}

export default TodoItem;
