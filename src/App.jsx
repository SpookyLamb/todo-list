import './App.css'

import { useState } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'

import { v4 as uuidv4 } from 'uuid'

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
    //Completed - Bool
  //TaskManager
// Create, Read, Update, Delete

//Functions below

function loadData() {
  const data = localStorage.getItem("tasks")
  const parsed = JSON.parse(data)

  if (parsed) { //invalid data is ignored
    return parsed
  } else {
    saveData([])
    return []
  }
}

function saveData(tasks) {
  const jsonData = JSON.stringify(tasks)

  localStorage.setItem("tasks", jsonData)
}

function constructTaskElements(new_tasks) {
  let task_elements = []

  //construct a new array of task elements, accordingly
  for (let i = 0; i < new_tasks.length; i++) {
    let object = new_tasks[i]
    task_elements.push(<Task title={object.title} complete={object.complete} key={object.id}/>)
  }

  return task_elements
}

//Components below

function Nuke(props) {
  const setTasks = props.function
  const setTaskElements = props.elementFunction

  function deleteAll() { //tabula rasa
    saveData([])
    setTasks([])
    setTaskElements([])
  }

  return (
    <Row>
      <Button onClick={deleteAll}>Clear All</Button>
    </Row>
  )
}

function Task(props) {
  const title = props.title

  return (
    <Row className="px-4">
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
      id: uuidv4(),
      complete: false,
    } )

    setTasks(new_tasks)
    saveData(new_tasks)
    setTaskElements(constructTaskElements(new_tasks))
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
    <Container className="task-list py-3 px-1">
      {taskElements}
    </Container>
  )
}

function TaskManager(props) {
  const setTasks = props.function
  const setTaskElements = props.elementFunction

  return (
    <Row>
      Task Manager
      <Nuke function={setTasks} elementFunction={setTaskElements}/>
    </Row>
  )
}

function Title() {
  //that really is the title it's not a note

  return(
    <h1>TO DO</h1>
  )
}

function App() {
  const [tasks, setTasks] = useState(loadData())
  const [taskElements, setTaskElements] = useState(constructTaskElements(tasks))

  return (
    <>
      <Title />
      <Container className="p-5 border">
        <TaskInput state={tasks} function={setTasks} elementFunction={setTaskElements}/>
        <TaskList state={taskElements} />
        <TaskManager function={setTasks} elementFunction={setTaskElements}/>
      </Container>
    </>
  )
}

export default App
