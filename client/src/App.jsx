import { useState } from 'react'
import'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './SignUp.jsx'
import Login from './Login.jsx'
import Canva from './Canva.jsx'
import {BrowserRouter,Routes,Route}from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/register' element={<SignUp/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/canva' element={<Canva/>}></Route>

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
