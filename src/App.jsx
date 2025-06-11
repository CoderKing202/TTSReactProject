import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router,Routes,Route,Link } from 'react-router-dom'
import Pricing from './components/Pricing'
import Login from './components/Login'
import './App.css'
import LogOut from './components/LogOut'
// import UserHome from './components/UserHome'
import Home from './components/Home'
import Register from './components/Register'
import PaymentPage from './components/PaymentPage'

function App() {
  return (
    <>
   <Router>
    <Routes>
      <Route path="/login" element={<Login type="user" loginurl = "http://localhost:5000/login"/>}/>
      {/* <Route path="/userHome" element={<UserHome/>}/> */}
      {/* <Route path="/paymentpage" element={<PaymentPage/>}/> */}
      <Route path="/signUp" element={<Register/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path='/logout' element={<LogOut/>}/>
      <Route path="/" element={<Home/>}/>
    </Routes>
   </Router>
    </>
  )
}

export default App
