import React, { useState } from "react";

function TodoForm(props) {

    const [newInput, setNewInput] = useState("")

    function handleSubmit(e){
        props.addTask(newInput)
        e.preventDefault()
        setNewInput("")
    }   
  return (
<form>
    <input type="Text"
           value={newInput} 
           onChange={(e) => setNewInput(e.target.value)}>

           </input>
    <button onClick={handleSubmit} >Add</button>
</form>    
  )
}

export default TodoForm;


