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

let globalSetTasks, globalSetTaskElements

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
    task_elements.push(<Task title={object.title} complete={object.complete} key={object.id} id={object.id}/>)
  }

  return task_elements
}

function changeCompletion(id, completed) {
  //searches the existing data for the object with a matching key, then changes its completion status and saves it
  let tasks = loadData()
  
  for (let i = 0; i < tasks.length; i++) {
    let object = tasks[i]
    
    if (object.id === id) {
      object.complete = completed
    }
  }

  saveData(tasks)
}

//Components below

function Nuke() {
  const setTasks = globalSetTasks
  const setTaskElements = globalSetTaskElements

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
  const id = props.id
  let complete = props.complete
  let initstyle = ""

  if (complete) {
    initstyle = "strikethrough"
  } else {
    initstyle = "clean"
  }

  const [checked, setCheck] = useState(complete)
  const [style, setStyle] = useState(initstyle)

  function checkOff() {
    //needs to update the visuals of the check box and the title
    //and also update the stored data

    complete = !complete //flip
    setCheck(complete)
    changeCompletion(id, complete)

    //handle strikethrough
    if (complete) {
      setStyle("strikethrough")
    } else {
      setStyle("clean")
    }
  }

  return (
    <Row className="px-4">
      <Col className="col-2">
        <input onChange={checkOff} type="checkbox" checked={checked}></input>
      </Col>
      <Col className="col-10 text-start">
        <p className={style}>{title}</p>
      </Col>
    </Row>
  )
}

function TaskInput(props) {
  const tasks = props.state
  const setTasks = globalSetTasks
  const setTaskElements = globalSetTaskElements

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

function TaskManager() {

  return (
    <Row>
      Task Manager
      <Nuke />
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

  globalSetTasks = setTasks
  globalSetTaskElements = setTaskElements

  return (
    <>
      <Title />
      <Container className="p-5 border">
        <TaskInput state={tasks} />
        <TaskList state={taskElements} />
        <TaskManager />
      </Container>
    </>
  )
}

export default App
