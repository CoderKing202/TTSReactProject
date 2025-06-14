import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';


const Pricing = () => {
  const [isloginresult,setisLoginResult] = useState({})
  const [membership,setMembership]=useState("free")
  useEffect(()=>{
    (
      async ()=>{
      const loginresponse = await fetch('http://localhost:5000/isloggedin',{credentials:'include'})
      const loginresult = await loginresponse.json()
      setisLoginResult(loginresult)
      setMembership(loginresult.user.version)

    })()
  },[])
  const navigate = useNavigate()
  
  const buyhandler= async(event)=>{
    
    if(isloginresult.result == false){
        navigate('/login',{state:{ membershiplogin:true }})
    }
    else{
      let result
      let takeMembership = false
      if( membership === 'premium' || membership === 'basic' ){
      result = confirm( `your ${membership} membership is not finished yet, if you continue then your ${membership} ,membership `+
         `will be cancelled and your ${event.target.id} monthly membership will start from now on So click on OK button to start paying for `+
         `the ${event.target.id} membership or click cancel to cancel the payment and continue eith your ${membership}` )
      if (result == true)
      {
        takeMembership = true
      }
      }
      else{
        takeMembership = true
      }
      if( takeMembership )
      {
        const payresponse = await fetch('http://localhost:5000/pay', { 
        method:'POST',
        credentials:'include',
        body:JSON.stringify( { version:event.target.id } ),
        headers:{'Content-Type':'application/json'}
       })
       const payresult = await payresponse.json()
       console.log(payresult)
       navigate('/')     
       }
    }
  }
  return (
    <>
    <NavBar/>
    <div className="container my-5">
      <h1 className="text-center mb-4">Our Pricing Plans</h1>
      <div className="row row-cols-1 row-cols-md-3 g-0">
        {/* Free Plan */}
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Free</h5>
              <p className="card-text">$0/month</p>
              <ul className="list-unstyled">
              <li style={{fontSize:'60px'}}>200 words</li>
              <li style={{fontSize:'40px'}}>2 voices only</li>
              </ul>
              {/* <button className="btn btn-primary" onClick={buyhandler}>Pay Now</button> */}
            </div>
          </div>
        </div>
        
        {/* Basic Plan */}
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Basic</h5>
              <p className="card-text">$6/month</p>
              <ul className="list-unstyled">
              <li style={{fontSize:'60px'}}>1000 words</li>
                <li style={{fontSize:'40px'}}>All voices available</li>
              </ul>
              {membership == 'free' || membership == 'premium'?<button className="btn btn-primary" id='basic' onClick={buyhandler}>Pay Now</button>:<span style={{color:'red'}}><b>You have already taken basic membership</b></span>}
            </div>
          </div>
        </div>
        
        {/* Premium Plan */}
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Premium</h5>
              <p className="card-text">$12/month</p>
              <ul className="list-unstyled">
                <li style={{fontSize:'60px'}}>10000 words</li>
                <li style={{fontSize:'40px'}}>All voices available</li>
              </ul>
              {membership === 'free' || membership === 'basic'?<button className="btn btn-primary" id="premium" onClick={buyhandler}>Pay Now</button>:<span style={{color:'red'}}><b>You have already taken Premium membership</b></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Pricing;
