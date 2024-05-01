import { useState } from 'react'
import { useReducer } from 'react'
import './App.css'

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

// Components:
  //TaskInput
  //TaskList
  //Tasks
    //ID - String
    //Title - String
    //Description - String
    //DateCreated - Date
    //DueDate - Date
    //Category/Label - String
    //Completed - Bool
  //TaskTracker

function Task(props) {
  const title = props.title

  return (
    <Row>
      {title}
    </Row>
  )
}

function TaskInput(props) {
  const tasks = props.state
  const setTasks = props.function
  const setTaskElements = props.elementFunction

  function addTask() {
    //takes input and adds a new task with setTasks, a state/hook function

    const input_field = document.getElementById("task-input")
    const input = input_field.value
    input_field.value = "" //clear the input
    let new_tasks = Array.from(tasks)

    //add a new task to our saved list
    new_tasks.push( {
      title: input,
    } )

    setTasks(new_tasks)

    let task_elements = []

    //construct a new array of task elements, accordingly
    for (let i = 0; i < new_tasks.length; i++) {
      let object = new_tasks[i]
      task_elements.push(<Task title={object.title} />)
    }

    setTaskElements(task_elements)
  }

  function keyCheck(event) { //check for the enter key, don't bother with other keys
    if (event.key === "Enter") {
      addTask()
    }
  }

  return (
    <Row>
      <Col className="col-8">
        <input onKeyUp={keyCheck} type="text" id="task-input"></input>
      </Col>
      <Col className="col-4">
        <Button onClick={addTask}>ADD</Button>
      </Col>
    </Row>
  )
}

function TaskList(props) {
  const taskElements = props.state

  return (
    <Container>
      {taskElements}
    </Container>
  )
}

function App() {
  const [tasks, setTasks] = useState([])
  const [taskElements, setTaskElements] = useState([])

  return (
    <Container>
      <TaskInput state={tasks} function={setTasks} elementFunction={setTaskElements}/>
      <TaskList state={taskElements} />
    </Container>
  )
}

export default App
