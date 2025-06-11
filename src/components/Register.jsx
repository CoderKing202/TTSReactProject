import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'

function Register(props) {
  const [formData,setFormData] = useState({email:'',password:'',confirmPassword:'',name:''})
  const [registerresult,setRegisterResult] = useState({
    result:true,
    uniqueEmail:true,
    uniqueUsername:true,
    passwordMatch:true,
  })
  const [fieldsStatus, setFieldStatus] = useState({
    email:true,
    password:true,
    name:true,
    confirmPassword:true
  })
  const navigate = useNavigate()

  useEffect(()=>{(async ()=>{
    const response = await fetch("http://localhost:5000/isloggedin",{ credentials: 'include' })
    const result = await response.json()
    console.log(result.result)
    if(result.result == true)
    {
        navigate('/')         
    }
  })()},[])

  const register = async ()=>{
    let tempfieldsstate = {
      email:true,
      password:true,
      name:true,
      confirmPassword:true
    }
    if(formData.email !=='' && formData.name !=='' && formData.password !== '' && formData.confirmPassword !=='')   
  {
    setFieldStatus( tempfieldsstate )
    const response = await fetch('http://localhost:5000/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData),
    credentials: 'include' }
)
const regresult = await response.json();
console.log(regresult)
if(regresult.result == false)
{
  setRegisterResult(regresult)
}
else{
        navigate('/login')         
}
}
else{

  if(formData.email === '')
  {
    tempfieldsstate.email = false
  }
  if(formData.name === '')
    {
      tempfieldsstate.name = false
    }
  if(formData.password === '')
  {
    tempfieldsstate.password = false
  }
  if(formData.confirmPassword === '')
  {
    tempfieldsstate.confirmPassword = false
  }
  console.log(tempfieldsstate)
  setFieldStatus(tempfieldsstate)
  setRegisterResult({
    result:true,
    uniqueEmail:true,
    passwordMatch:true,
  })
}

  }
  const handleEmail=(event)=>{
      setFormData({ email:event.target.value,password:formData.password, name:formData.name , confirmPassword : formData.confirmPassword })

  }
  const handlePassword=(event)=>{
    setFormData({ email:formData.email,password:event.target.value, name:formData.name , confirmPassword : formData.confirmPassword })
    
  }
  const handleUsername=(event)=>{
    setFormData({ email:formData.email,password:formData.password, name:event.target.value , confirmPassword : formData.confirmPassword })
   
}
const handleconfirmPassword=(event)=>{
  setFormData({ email:formData.email,password:formData.password,name:formData.name , confirmPassword : event.target.value })

}



  return (
    <>
     <NavBar/>
    <div id="form">
<h1><b>SignUp</b></h1>
  <div className="form-floating mb-3">
  {fieldsStatus.email?(registerresult.uniqueEmail?<><input type="email" className="form-control" onChange={handleEmail} value={formData.email} id="floatingInput" placeholder='a'/>
   <label htmlFor="floatingInput">Email address</label></>:
   <><input type="email" className="form-control is-invalid" id="floatingInputInvalid" onChange={handleEmail} value={formData.email} placeholder='a' />
   <label htmlFor="floatingInput">Email address already exists</label></>):<><input type="email" className="form-control is-invalid" id="floatingInputInvalid" placeholder='a'
   onChange={handleEmail} value={formData.email}/>
   <label htmlFor="floatingInput">Please Enter Email</label></>}
</div>


<div className="form-floating mb-3">
  {fieldsStatus.name?<><input type="text" className="form-control" onChange={handleUsername} value={formData.username} id="floatingInput" placeholder='a'/>
  <label htmlFor="floatingInput">Name</label></>:<><input type="text" className="form-control is-invalid" id="floatingInputInvalid" placeholder='a' 
   onChange={handleUsername} value={formData.username}/>
   <label htmlFor="floatingInput">Please Enter Name </label></>}
</div>

{
  ( ! registerresult.passwordMatch)?<div class="alert alert-danger" role="alert">
Password and confirmPassword should match
</div>:<></>
}

<div className="form-floating mb-3">
  {fieldsStatus.password?<><input type="password" className="form-control" onChange={handlePassword} value={formData.password} id="floatingPassword" placeholder="Enter Password"/>
  <label htmlFor="floatingPassword">Password</label></>:<><input type="password" className="form-control is-invalid" id="floatingInputInvalid"  placeholder='a'
   onChange={handlePassword} value={formData.password}/>
   <label htmlFor="floatingInput">Please enter Password </label></>}
</div>

<div className="form-floating mb-3">
  {fieldsStatus.confirmPassword?<><input type="password" className="form-control" onChange={handleconfirmPassword} value={formData.confirmPassword} id="floatingPassword" placeholder="Confirm Password"/>
  <label htmlFor="floatingPassword">Confirm Password</label></>:<><input type="password" className="form-control is-invalid" id="floatingInputInvalid"  placeholder='a'
   onChange={handleconfirmPassword} value={formData.confirmPassword}/>
   <label htmlFor="floatingInput">Please confirm Password </label>
  </>}
</div>
<button className="btn btn-primary"  style={{marginTop:'-20px'}} onClick={register}>Register</button>
Already have an account?<Link  style={{marginTop:'-20px'}} to="/login">Login</Link>
    </div>
    </>
  )
}

export default Register