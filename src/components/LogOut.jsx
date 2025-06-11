import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
function LogOut(props) {
const navigate = useNavigate()
const [logoutSuccess,setLogoutSuccess] = useState(false)
useEffect(()=>{
(async ()=>{
  const logoutresponse=await fetch('http://localhost:5000/logout',{credentials:'include'})
  const logoutresult = await logoutresponse.json()
  if(logoutresult.result)
  {
      setLogoutSuccess(true)
      navigate('/')
  }
  else{
    setLogoutSuccess(false)
    
  }
})()
},[])
  return (
    <>
    {!logoutSuccess?<><NavBar/>
    <center>
    <span>Could not LogOut Try again </span>
    </center>
    </>:<></>}
    </>
  )
}

export default LogOut