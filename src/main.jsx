// Must Have (DONE)
  // Repo created from Vite - not the bootcamp prebuilt template (DONE)
  // Deploy to Vercel (DONE)
  // Wireframe - in addition to the design wireframe, design information (state) flow (DONE)
  // Responsive design (DONE?)
  // Dynamically render the content with React using components (DONE)
  // C.R.U.D. for list items (DONE)
  // Save all data in Local Storage (DONE)
  
// Should Have
  // Completed items are crossed out or checked off
  // Three "views" for the user: All, Completed, & To-Do (not completed)
    // Each view should have a total count

// Could Have
  // ‘Archive’ items instead of delete.  (soft delete)  Should move items to an archive list that they can be restored from. 
  // Check off or cross out all items in one click as a "completed all" function
  // Animations/sound/etc. to celebrate item completion

// Wish List
  // Undo button - should ‘undo’ whatever the last action was.  For example, archive item, unarchive item, check complete, create item, update item, uncheck complete, etc. 
  // Keyboard shortcuts for CRUD actions. 
  // Edit To-Do's inline with a doubleclick event that changes it from a rendered text to a text input.
  // Reminders functionality - add due dates and alarms to list items
  // If an item has a due date and is past it’s time, automatically change its status to ‘Overdue’
  // Mark item as ‘private’.  Its information should be hidden unless the user enters a password.  

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
