import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'

function Login(props) {
  const location=useLocation()
  const [formData,setFormData] = useState({email:'',password:''})
  const [loginresult,setLoginResult] = useState( {result:true} )
  const [fieldsStatus, setFieldStatus] = useState({email:true,password:true})
  const navigate = useNavigate()
  const {membershiplogin} = location.state || {}


  useEffect(()=>{(async ()=>{
    const response = await fetch("http://localhost:5000/isloggedin",{ credentials: 'include' })
    const result = await response.json()
 
    if(result.result == true)
    {
      navigate('/')        
    }
  })()},[])


  const login=async ()=>{
    if(formData.email !== '' && formData.password !== '')
    {
      setFieldStatus( {email:true, password:true} )
  const response = await fetch(props.loginurl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData),
    credentials: 'include' },
)
const logresult = await response.json();
if(logresult.result == false)
{
  setLoginResult(logresult)
}
else{
        navigate('/')        
}
    }
    else{
      setLoginResult({result:true})
      if(formData.email == ''){
        setFieldStatus( {email:false, password:true} )
      }
      if(formData.password == '')
      {
        setFieldStatus( {email:true, password:false} )
      }
      if(formData.email == '' && formData.password == '')
      {
        setFieldStatus( {email:false, password:false} )
      }
    }
  }
  const handleEmail=(event)=>{
      setFormData({ email:event.target.value,password:formData.password })
  }
  const handlePassword=(event)=>{
    setFormData({ email : formData.email,password : event.target.value })
  }
  return (
    <>
    <NavBar/>

    <div id="form">

        {membershiplogin?<h1><b>Login First</b></h1>:<h1><b>Login</b></h1>}

        {loginresult.result == false?<div className="alert alert-danger" role="alert">
  Please enter Correct Credentials
</div>:<></>}

            <div className="form-floating mb-3">
  {fieldsStatus.email?<><input type="email" className="form-control" onChange={handleEmail} value={formData.email} id="floatingInput" placeholder='email' />
  <label htmlFor="floatingInput">Email address</label></>:<><input type="email" className="form-control is-invalid" id="floatingInputInvalid" onChange={handleEmail} value={formData.email}
  placeholder='a'/>
  <label htmlFor="floatingInput">Please Enter Email</label></>}
  
  
</div>
<div className="form-floating mb-3">
  {fieldsStatus.password?<><input type="password" className="form-control" onChange={handlePassword} value={formData.password} id="floatingPassword" placeholder="Password"/>
  <label htmlFor="floatingPassword">Password</label></>:<><input type="password" className="form-control is-invalid" id="floatingInputInvalid" onChange={handlePassword} value={formData.password}
  placeholder='a'/>
  <label htmlFor="floatingInput">Please Enter Password</label></>}
</div>
<button className="btn btn-primary" style={{marginTop:'-20px'}}onClick={login}>Login</button>
{props.type =='user'?<>Don't have an account? then<Link to="/signUp" style={{marginTop:'-20px'}}>SignUp</Link></>:<></>}
    </div>
    </>
  )
}

export default Login