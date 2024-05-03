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

//to edit:
// give each element an edit button that turns on editing mode and makes the input field grab keyboard focus with .focus()

//Functions below

let globalSetTasks, globalSetTaskElements, globalSetTaskCount, globalDisplayTab;

let editing = false;
let edit_id = "";

let current_tab = "all";

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
    task_elements.push(<Task title={object.title} complete={object.complete} id={object.id} key={object.id}/>)
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

function handleTasks(new_tasks) {
  const setTasks = globalSetTasks
  const setTaskElements = globalSetTaskElements
  const setTaskCount = globalSetTaskCount

  setTasks(new_tasks)
  saveData(new_tasks)
  setTaskCount(getTaskCount())

  const task_elements = constructTaskElements(new_tasks)
  setTaskElements(task_elements)
}

function getTaskCount() {
  const tasks = loadData()
  let active_tasks = tasks.filter((task) => {
    if (!task.complete) {
      return task
    }
  })
  return active_tasks.length
}

//Components below

function Nuke(props) {
  const displayTab = props.tabfunc

  function deleteAll() { //tabula rasa
    //updates all of the elements
    //needs to also update the visuals -- TODO
    handleTasks([])
    displayTab("all")
  }

  return (
    <Row>
      <Button className="main-box box-shadow" onClick={deleteAll}>Clear All</Button>
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
      document.getElementById('party-blower').play()
    } else {
      setStyle("clean")
    }

    globalDisplayTab(current_tab) //redraw the current tab so items disappear accordingly
    globalSetTaskCount(getTaskCount()) //reset task count
  }

  function editMode() {
    const input = document.getElementById("task-input")
    input.value = title

    editing = true
    edit_id = id

    input.focus()
  }

  function deleteMe() {
    const tasks = loadData()

    let new_tasks = Array.from(tasks)

    for (let i = 0; i < new_tasks.length; i++) {
      let task = new_tasks[i]

      if (task.id === id) {
        new_tasks.splice(i, 1) //remove the element

        handleTasks(new_tasks)
        break;
      }
    }
  }

  return (
    <Row className="px-4 py-1">
      <Col className="col-2 col-lg-2">
        <input className="checkbox my-auto" onChange={checkOff} type="checkbox" checked={checked}></input>
      </Col>
      <Col className="col-6 col-lg-8 text-start">
        <p className={style + " open-sans"}>{title}</p>
      </Col>
      <Col className="col-4 col-lg-2 d-flex justify-content-end">
        <a className="pe-1" onClick={editMode} href="#">Edit</a>
        <a className="ps-1" onClick={deleteMe} href="#">Delete</a>
      </Col>
    </Row>
  )
}

function TaskInput() {

  function addTask() {
    //takes input and adds a new task with setTasks, a state/hook function

    const input_field = document.getElementById("task-input")
    const input = input_field.value
    input_field.value = "" //clear the input

    if (!input) { //empty string, ignore
      return 
    }
    
    let new_tasks = loadData()

    if (editing) {
      //edit an existing task using edit_id

      for (let i = 0; i < new_tasks.length; i++) {
        let task = new_tasks[i]

        if (task.id === edit_id) {
          new_tasks[i] = {
            title: input,
            id: edit_id,
            complete: false,
          }

          break;
        }
      }

      editing = false //reset vars when done
      edit_id = ""
    } else {
      //add a new task to our saved list
      new_tasks.push( {
        title: input,
        id: uuidv4(),
        complete: false,
      } )
    }

    handleTasks(new_tasks)
  }

  function keyCheck(event) { //check for the enter key, don't bother with other keys
    if (event.key === "Enter") {
      addTask()
    }
  }

  return (
    <Container className="py-4 px-2">
      <Row className='py-2 border border-dark main-box box-shadow'>
        <Col className="col-12 py-2 px-3 mx-auto d-flex justify-content-center">
          <input className="box-shadow" onKeyUp={keyCheck} type="text" id="task-input"></input>
          <div className="ps-2">
            <Button className="box-shadow" onClick={addTask}>-&gt;</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

function TaskList(props) {
  const taskElements = props.state

  return (
    <Container className="task-list py-2 px-1 border border-dark main-box box-shadow" id="the-task-list">
      {taskElements}
    </Container>
  )
}

function TaskManager() {
  const [task_count, setTaskCount] = useState(loadData().length)
  const [all_disabled, setAllDisabled] = useState(true) //starts in the all view by default
  const [active_disabled, setActiveDisabled] = useState(false)
  const [completed_disabled, setCompletedDisabled] = useState(false)

  globalSetTaskCount = setTaskCount

  function deleteCompleted() {
    const tasks = loadData()
    const new_tasks = tasks.filter((task) => {
      if (!task.complete) {
        return task
      }
    })

    handleTasks(new_tasks)
  }

  function displayTab(tab) {
    //updates task elements specifically without touching the actual underlying data
    //needs to also disable the relevant button
    const setTaskElements = globalSetTaskElements

    setAllDisabled(false) //enable all by default
    setActiveDisabled(false)
    setCompletedDisabled(false)

    let new_tasks = loadData()

    switch (tab) {
      case "active":
        new_tasks = new_tasks.filter((task) => {
          if (!task.complete) {
            return task
          }
        })
        setActiveDisabled(true)
        current_tab = "active"
        break;
      case "complete":
        new_tasks = new_tasks.filter((task) => {
          if (task.complete) {
            return task
          }
        })
        setCompletedDisabled(true)
        current_tab = "complete"
        break;
      default: //all
        setAllDisabled(true)
        current_tab = "all"
        break;
    }

    setTaskElements(constructTaskElements(new_tasks))
  }

  globalDisplayTab = displayTab

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center px-1 py-1 border border-dark border-top-0 main-box box-shadow">
          <Col className="col-12">
            <Button variant="link" onClick={() => {displayTab("all")}} disabled={all_disabled}>All</Button>
            <Button variant="link" onClick={() => {displayTab("active")}} disabled={active_disabled}>Active</Button>
            <Button variant="link" onClick={() => {displayTab("complete")}} disabled={completed_disabled}>Completed</Button>
          </Col>
        </Row>
      </Container>
      <Container className="py-3">
        <Row className="px-1 py-1 border border-dark main-box box-shadow">
          <Col className='col-12 d-flex justify-content-center'>
            <p className='my-auto'>{task_count + " Left"}</p>
            <Button variant="link" onClick={deleteCompleted}>Clear Completed</Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="pt-2">
          <Col className='mx-auto col-6 col-lg-4 px-5 py-1'>
            <Nuke tabfunc={displayTab}/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

function Title() {
  //that really is the title it's not a note

  return(
    <h1 className="dancing-script">TO DO</h1>
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
      <Container className="p-1 container-fluid">
        <TaskInput />
        <TaskList state={taskElements} />
        <TaskManager />
      </Container>
    </>
  )
}

export default App
