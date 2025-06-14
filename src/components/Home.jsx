import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { version } from "mongoose";

function Home() {
  let spvoices = responsiveVoice.getVoices();
  
  const [voices, setVoices] = useState([]);
  const [membershipEndTrigger, setMembershipEndTrigger] = useState(false);
  const navigate = useNavigate();
  const [currentvoice, setCurrentVoice] = useState(voices[0]);
  let synth = window.speechSynthesis;

  const [buttonState, setState] = useState("fas fa-play");
  const [isPlay, setPlay] = useState(false);
  const [totalletters, setTotalletters] = useState(200);
  const [isEmpty, setEmpty] = useState(false);

  const [text, setText] = useState("");
  const [islogin, setLogin] = useState(false);
  const [user, setUser] = useState({ version: "free" });

  useEffect(() => {
    (async () => {
      setVoices([spvoices[0], spvoices[1]]);
      console.log("enode" + navigator.language);
      setCurrentVoice(spvoices[0]);
      let membershipcancel = false;
      const response = await fetch("http://localhost:5000/isloggedin", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.result) {
        if (
          result.user.version === "basic" ||
          result.user.version === "premium"
        ) {
          console.log("Hello 300");
          const memebershipCheckresponse = await fetch(
            "http://localhost:5000/membershipexpired",
            { credentials: "include" }
          );
          const membershipCheckresult = await memebershipCheckresponse.json();
          if (membershipCheckresult.success) {
            alert(
              `Your ${result.user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`
            );
            setTotalletters(200);
            setText("");
            membershipcancel = true;
            document.getElementById("playButton").disabled = false;
          }
        }
      }

      if (result.result) {
        setUser(result.user);
        if (result.user.version === "basic") {
          if (membershipcancel) {
            setTotalletters(200);
            setVoices([spvoices[0], spvoices[1]]);
          } else {
            setTotalletters(1000);
            setVoices(spvoices);
          }
        }
        if (result.user.version === "premium") {
          if (membershipcancel) {
            setTotalletters(200);
            setVoices([spvoices[0], spvoices[1]]);
          } else {
            setTotalletters(10000);
            setVoices(spvoices);
          }
        }
      }
    })();
  }, [membershipEndTrigger]);

  const voiceHandler = (event) => {
    setCurrentVoice(voices[parseInt(event.target.value)]);
  };

  const playPause = async () => {
    let voiceCancel = false;
    
      if (user.version === "basic" || user.version === "premium") {
        const memebershipCheckresponse = await fetch(
          "http://localhost:5000/membershipexpired",
          { credentials: "include" }
        );
        const membershipCheckresult = await memebershipCheckresponse.json();
        if (membershipCheckresult.success) {
          alert(
            `Your ${user.version} membership is over If you want to use the app please renew your membership with basic or primary membership`
          );
          setTotalletters(200);
          setText("");
          voiceCancel = true;
          setMembershipEndTrigger(true);
          setVoices(spvoices);
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
          onChange={voiceHandler}
        >
          <option value="0">Choose Voices</option>
          {voices.map((voice, id) => {
            return (
              <option key={id} value={id}>
                {id == 0 ? <>{voice.name}(Default)</> : voice.name}
              </option>
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
