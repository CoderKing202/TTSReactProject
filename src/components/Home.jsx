import React, { use, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import { version } from 'mongoose';

function Home() {
  let spvoices = window.speechSynthesis.getVoices();

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
  let startfunction = ()=>{
    spvoices = window.speechSynthesis.getVoices();
    
    setVoices([spvoices[0],spvoices[1]])
    setCurrentVoice(spvoices[0])
  }
  useEffect(()=>{
    (async()=>{
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
          setText(text.substring(0,200))
          membershipcancel = true
      }
      }
    }
      startfunction()
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
  synth.onvoiceschanged = startfunction


 
 
//  let spvoices =[]

    
    const voiceHandler=(event)=>{
      console.log(event.target.value)
      setCurrentVoice(voices[parseInt(event.target.value)])
    }

    const playPause = async ()=>{
      let voiceCancel = false
      if(!synth.speaking)
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
            if(!synth.speaking)
            {
              let utterance = new SpeechSynthesisUtterance(text);
              utterance.onend=()=>{ setState('fas fa-play') }
              utterance.voice = currentvoice
              console.log(utterance.voice)
              synth.speak(utterance);
              if( voiceCancel )
              {
                synth.cancel()
              }
            }
            if(buttonState === 'fas fa-play')
                {
                  setState('fas fa-pause')
                  synth.resume(); 
                }
                else{
                    setState('fas fa-play')
                    
                    synth.pause();
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
<button type="button" style={{width:'42px',marginBottom:20}} className="btn btn-danger" onClick={playPause}><i className={buttonState}></i></button>
</div>
    </div>
    </>
  )
}

export default Home