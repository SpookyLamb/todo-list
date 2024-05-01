import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

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

function Task() {
  return (
    <Row>
      TASK
    </Row>
  )
}

function TaskList() {
  return (
    <Container>
      <Task />
    </Container>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id="app">
      <TaskList />
    </div>
  )
}

export default App
