import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { version } from "mongoose";
import { FaCrown } from 'react-icons/fa'

function Home() {
  let spvoices = responsiveVoice.getVoices();
  const [voices, setVoices] = useState([]);
  const [membershipEndTrigger, setMembershipEndTrigger] = useState(false);
  const navigate = useNavigate();
  const [currentvoice, setCurrentVoice] = useState(voices[0]);
  const [selectedOption,setSelectedOption] = useState("choose") 
  let synth = window.speechSynthesis;
  const [buttonState, setState] = useState("fas fa-play");
  const [isPlay, setPlay] = useState(false);
  const [totalletters, setTotalletters] = useState(200);
  const [isEmpty, setEmpty] = useState(false);
  const [text, setText] = useState("");
  const [loginResult, setLoginResult] = useState({});
  const [user, setUser] = useState({ version: "free" });
  


  useEffect(() => {
    (async () => {
      setVoices(spvoices);
      setCurrentVoice(spvoices[0]);
      let membershipcancel = false;
      const response = await fetch("http://localhost:5000/isloggedin", {
        credentials: "include",
      });
      const result = await response.json();
      setLoginResult(result)
      if (result.result) {
        if (
          result.user.version === "basic" ||
          result.user.version === "premium"
        ) {
          console.log("Hello 300");
          setUser(result.user);
          const membershipCheckresponse = await fetch(
            "http://localhost:5000/membershipexpired",
            { credentials: "include" }
          );
          const membershipCheckresult = await membershipCheckresponse.json();
          if (membershipCheckresult.success) {
            alert(
              `Your ${result.user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`
            );
            setTotalletters(200);
            setText("");
            membershipcancel = true;
            document.getElementById("playButton").disabled = false;
            setUser({version:'free',name:result.user.name})
          }
        }
        else{
          setUser(result.user);
        }
      
        
        if (result.user.version === "basic") {
          if (membershipcancel) {
            setTotalletters(200);
            
          } else {
            setTotalletters(1000);
            
          }
        }
        if (result.user.version === "premium") {
          if (membershipcancel) {
            setTotalletters(200);
            
          } else {
            setTotalletters(10000);
            
          }
        }
      }
    })();
  }, [membershipEndTrigger]);

  const voiceHandler = (event) => {
    if(user.version === 'basic' || user.version === 'premium' )
    {
      setSelectedOption(event.target.value)
      if(event.target.value !== 'choose')
      {
      setCurrentVoice(voices[parseInt(event.target.value)]);
      }
      else{
        setCurrentVoice(voices[0]);
      }
    }
    else if(user.version === 'free'){
      if(event.target.value <= 1)
      {
      console.log(event.target.value)
      setSelectedOption(event.target.value)
      setCurrentVoice(voices[parseInt(event.target.value)]);
      }
      else
      {
        if((event.target.value !== 'choose')){
          if(!loginResult.result)
          {
            alert(`If you want to use "${voices[parseInt(event.target.value)].name}" voice then login and take premium or basic membership`)
          }
          else{
            alert(`${loginResult.user.name} if you want to use "${voices[parseInt(event.target.value)].name}" voice then take premium or basic membership`)
          }
        }
        setSelectedOption("choose")
          setCurrentVoice(voices[0]);
      }
    }
  };

  const playPause = async () => {
    let voiceCancel = false;
      if (user.version === "basic" || user.version === "premium") {
        const membershipCheckresponse = await fetch(
          "http://localhost:5000/membershipexpired",
          { credentials: "include" }
        );
        const membershipCheckresult = await membershipCheckresponse.json();
        if (membershipCheckresult.success) {
          alert(
            `Your ${user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`
          );
          setTotalletters(200);
          setText("");
          voiceCancel = true;
          setMembershipEndTrigger(true);
          setVoices(spvoices);
          setUser({version:'free'})
          setSelectedOption('choose')
        }
      }
    

    if (text == "") {
      setEmpty(true);
    } else {
      setEmpty(false);

      if (!isPlay) {
        document.getElementById("playButton").disabled = true;
        setPlay(true);
        
       
        if (!voiceCancel) {
          const timeOutId=setTimeout(() => {
            alert(
              "Could not generate the voice Pease try again by click on generate button or choose another voice and then click on generate button and if still does not work then reload the web page please"
            );
            setPlay( false );
            document.getElementById("playButton").disabled = false;
            responsiveVoice.cancel()
        }, 25000);
        responsiveVoice.cancel()
          responsiveVoice.speak(text, currentvoice.name, {
            onstart: () => {
              document.getElementById("playButton").disabled = false;
              setPlay(false);
              console.log("start");
              
              clearTimeout(timeOutId);
            },
          });
        } else {
          setPlay(false);
          document.getElementById("playButton").disabled = false;
          responsiveVoice.cancel()
        }
      }
    }
  };
  return (
    <>
      <NavBar />

      <div id="form">
        {user.name ? <b>Welcome {user.name}</b> : <></>}
        <b>Voices:</b>
        <select
          className="form-select"
          aria-label="Default select example"
          id="voiceselector"
          value={selectedOption}
          onChange={voiceHandler}
          style={{textAlign:'center'}}
        >
          <option value="choose">Choose Voices</option>
          {voices.map((voice, id) => {
            return (
                <>
                {(id == 0)? <option key={id} value={id}>{voice.name}(Default)</option> :(user.version === 'basic' || user.version === 'premium')?<option key={id} value={id}>{voice.name}</option>:(id >= 2)?<option key={id} className='bg-primary'value={id} style={{color:'#ffffff',fontWeight:'bold'}}> 👑&nbsp;&nbsp;&nbsp;&nbsp;{voice.name}</option>:<option key={id} value={id}>{voice.name}</option>}
                </>
            );
          })}
        </select>
        {text.length == 200 && user.version === "free" ? (
          <span
            style={{
              color: "red",
              marginTop: 0,
              textAlign: "center",
              fontSize: 30,
            }}
          >
            For more words translation and for more features take our{" "}
            <Link to="/pricing">Membership</Link>
          </span>
        ) : (
          <></>
        )}

        <div className="form-floating">
          <textarea
            className={!isEmpty ? "form-control" : "form-control is-invalid"}
            placeholder="Leave a comment here"
            id={!isEmpty ? "floatingTextarea2" : "floatingTextarea2Invalid"}
            value={text}
            onChange={(event) => {
              if (event.target.value) {
                setEmpty(false);
              }
              let temptext = event.target.value.substring(0, totalletters);
              setText(temptext);
            }}
          ></textarea>
          {text == "" ? (
            <label htmlFor="floatingTextarea2">
              {isEmpty
                ? "Enter at least one word to convert to speech"
                : "Enter the text you want to convert to speech"}
            </label>
          ) : (
            <label htmlFor="floatingTextarea2">
              {text.length}/{totalletters}
            </label>
          )}
        </div>

        <div id="voicebuttons">
          {isPlay ? (
            <button
              type="button"
              style={{ width: "122px", marginBottom: 20, fontSize: "20px" }}
              className="btn btn-danger"
              id="playButton"
              onClick={playPause}
            >
              <i className="fas fa-circle-notch fa-spin"></i>
            </button>
          ) : (
            <button
              type="button"
              style={{ width: "122px", marginBottom: 20, fontSize: "20px" }}
              className="btn btn-danger"
              id="playButton"
              onClick={playPause}
            >
              <b>Generate</b>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
