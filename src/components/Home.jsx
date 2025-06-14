import React, { use, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import { version } from 'mongoose';

function Home() {
  let synthvoices = window.speechSynthesis.getVoices();
  console.log(synthvoices)
  let spvoices = responsiveVoice.getVoices()
const [isSpeaking,setSpeaking] = useState(false)
  const [ voices, setVoices ] = useState([])
  const [membershipEndTrigger,setMembershipEndTrigger] = useState(false)
  const navigate = useNavigate()
  const [currentvoice,setCurrentVoice] = useState(voices[0])
  let synth = window.speechSynthesis
  
    const [ buttonState, setState ] = useState('fas fa-play')
    const [totalletters,setTotalletters] = useState(200)
    const [isEmpty,setEmpty] = useState(false)
    const [isPause,setPause] = useState(false)
    const [text,setText] = useState("")
  const [islogin,setLogin] = useState(false)
  const [user,setUser] = useState({ version:'free' })
  // let startfunction = ()=>{
  //   spvoices = window.speechSynthesis.getVoices();
  const  estimateSpeechDuration=(text, wpm = 130)=> {
    const words = text.trim().split(/\s+/).length;
    const minutes = words / wpm;
    return minutes * 60 * 1000; // in milliseconds
  }
  
 
  // }
  useEffect(()=>{
    (async()=>{
      setVoices([spvoices[0],spvoices[1]])
      console.log("enode"+navigator.language)
      setCurrentVoice(spvoices[0])
      let membershipcancel = false
      const response = await fetch( 'http://localhost:5000/isloggedin',{credentials:'include'} )
      const result = await response.json()
      
      if(result.result){
      if(result.user.version === 'basic' || result.user.version === 'premium'){
        console.log("Hello 300")
      const memebershipCheckresponse = await fetch('http://localhost:5000/membershipexpired',{credentials:'include'})
      const membershipCheckresult = await memebershipCheckresponse.json()
      if(membershipCheckresult.success){
          alert(`Your ${result.user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`)
          setTotalletters(200)
          setText("")
          membershipcancel = true
          document.getElementById("playButton").disabled = false;
      }
      }
    }
      // startfunction()
      if(result.result)
        {
            setUser(result.user)
            if(result.user.version === 'basic')
            {
              if(membershipcancel)
              {
                setTotalletters(200)
                setVoices([spvoices[0],spvoices[1]])
              }
              else{
                setTotalletters(1000)
                setVoices(spvoices)
              }
                
              
            }
            if(result.user.version === 'premium'){
              if( membershipcancel )
              {
                setTotalletters(200)
                setVoices([spvoices[0],spvoices[1]])
              }
              else{
                setTotalletters(10000)
                setVoices(spvoices)
              }
              
          }
        }
    })()
  },[membershipEndTrigger])
  // synth.onvoiceschanged = startfunction


 
 
//  let spvoices =[]

    
    const voiceHandler=(event)=>{
      setCurrentVoice(voices[parseInt(event.target.value)])
    }

    const playPause = async ()=>{
      
      let voiceCancel = false
      if(!isSpeaking)
      {
      if( user.version === 'basic' || user.version === 'premium' ){
        const memebershipCheckresponse = await fetch('http://localhost:5000/membershipexpired',{credentials:'include'})
        const membershipCheckresult = await memebershipCheckresponse.json()
      if( membershipCheckresult.success ){
        alert(`Your ${user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`)
        setTotalletters(200)
        setText("")
        voiceCancel = true
        setMembershipEndTrigger(true)
        setVoices(spvoices)
        
    }
  }
}

        if(text == ''){
            setEmpty(true)
        }
        else{
            setEmpty(false)
            if(!isSpeaking)
            {   
              // let utterance = new SpeechSynthesisUtterance(text);
              if(!voiceCancel)
              {
                
                let voiceStarted = false
              responsiveVoice.speak( text, currentvoice.name,{
                onend:()=>{ 
                setState('fas fa-play')
                document.getElementById("playButton").disabled = false;
                setSpeaking(false)
               },
               
               onstart:()=>{
                voiceStarted = true
                setState('fas fa-pause')
                setSpeaking(true)
                // const intervalId = setInterval(()=>{
                 
                //     if( !responsiveVoice.isPlaying()){
                //       console.log("Hello345 ," + responsiveVoice.isPlaying())
                //       setState('fas fa-play')
                //       setSpeaking(false)
                //       document.getElementById("playButton").disabled = false;
                //       clearInterval(intervalId)
                  
                //     }
                // },1)
                setTimeout(()=>{
                  console.log("Hello345 ," + responsiveVoice.isPlaying())
                      setState('fas fa-play')
                      setSpeaking(false)
                      document.getElementById("playButton").disabled = false;
                      
                },estimateSpeechDuration(text))
                
                // // if( voiceCancel )
                // {
                //   // synth.cancel()
                //   console.log("Sushila")
                //   responsiveVoice.cancel()
              
                // }
              }} )
         
            }
            else{
              setSpeaking(false)
            }              
          
              // utterance.onend=()=>{ setState('fas fa-play') }
              
              // utterance.voice = currentvoice

              // console.log(utterance.voice)
              // synth.speak(utterance);
              
             
            }
            if(buttonState === 'fas fa-play')
                {
                  // setState('fas fa-pause')
                  document.getElementById("playButton").disabled = true;
                  if(isSpeaking)
                  {
                    setState('fas fa-pause')
                  }
                  else{
                    setState('fas fa-circle-notch fa-spin')
                  }
                  // synth.resume(); 
                  if(!voiceCancel)
                  {
                  responsiveVoice.resume()
                  setPause(false)
                  }
                  else{
                    setState("fas fa-play")
                    document.getElementById("playButton").disabled = false;
                  }
                }
                else{
                 
                    setState('fas fa-play')
                    setPause(true)                    
                    // synth.pause();
                    responsiveVoice.pause()
                  
                }

                
            }
    }
  return (
    <>
    <NavBar/>
    
    <div id="form">
    {user.name?<b>Welcome {user.name}</b>:<></>}
    <b>Voices:</b>
    <select className="form-select" aria-label="Default select example" id="voiceselector" onChange={voiceHandler}>
      <option value="0">Choose Voices</option>
  {
  voices.map((voice,id)=>{
    return(
      
    <option key={id} value={id}>{id==0?<>{voice.name}(Default)</>:voice.name}</option>
  )
  })
  }
</select>
    {(text.length == 200 && user.version === 'free')?<span style={{color:'red',marginTop:0,textAlign:'center',fontSize:30}}>For more words translation and for more features take our <Link to='/pricing'>Membership</Link></span>:<></>}
    
     <div className="form-floating">
  <textarea className={!isEmpty?"form-control":"form-control is-invalid"} placeholder="Leave a comment here" id={!isEmpty?"floatingTextarea2":"floatingTextarea2Invalid"} value={text} 
  onChange={(event)=>{ if(event.target.value){setEmpty(false)}let temptext=event.target.value.substring(0,totalletters);setText(temptext) }}></textarea>
  {(text == '')?<label htmlFor="floatingTextarea2">{ (isEmpty)?"Enter at least one word to convert to speech":"Enter the text you want to convert to speech"}</label>:<label htmlFor="floatingTextarea2">{text.length}/{totalletters}</label>}
</div>

<div id="voicebuttons">
<button type="button" style={{width:'42px',marginBottom:20}} className="btn btn-danger" id="playButton" onClick={playPause}><i className={buttonState}></i></button>
</div>
    </div>
    </>
  )
}

export default Home