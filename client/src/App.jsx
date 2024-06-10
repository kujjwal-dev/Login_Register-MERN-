import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from "./Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Login"
import Home from "./Home"
import ForgotPassword from "./ForgotPassword"


function App() {
 

  return (
   <BrowserRouter>
       <Routes>
        <Route path="/register" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/home"  element={<Home/>}></Route>
        <Route path="/forgot-password"  element={<ForgotPassword/>}></Route>
       </Routes>
   </BrowserRouter>
  )
}

export default App
