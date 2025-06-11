import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
function NavBar() {
  const [islogin,setLogin] = useState(false)
  useEffect(()=>{(async ()=>{
    const response = await fetch("http://localhost:5000/isloggedin",{ credentials: 'include' })
    const result = await response.json()
  
    setLogin(result.result)
  })()},[])

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/" onClick={()=>{window.speechSynthesis.cancel()}}>TTSApp</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
       { !islogin?<><li className="nav-item">
          <Link className="nav-link text-white" aria-current="page" to="/signUp" onClick={()=>{window.speechSynthesis.cancel()}}>SignUp</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to='/login' onClick={()=>{window.speechSynthesis.cancel()}}>Login</Link>
        </li></>:<>
        <li className="nav-item">
          <Link className="nav-link text-white" to='/logout' onClick={()=>{window.speechSynthesis.cancel()}}>LogOut</Link>
        </li>
        </>}
        <li className="nav-item">
          <Link className="nav-link text-white" to="/pricing" onClick={()=>{window.speechSynthesis.cancel()}}>Pricing</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</>
  )
}

export default NavBar