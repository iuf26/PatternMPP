import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { LOGIN_REQUEST } from "./routes/routes";
import BoardGame from "./components/BoardGame";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import SockJsClient from "react-stomp";
import ScoresTable from "./components/ScoresTable";
//Aici e main-ul
function App() {
  var stompClient = null;
 
  const [board, setBoard] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alias, setAlias] = useState("");
  const [initScores,setInitScores] = useState("");
  const [scoresTable,setScoresTable] = useState([]);
  const [websocket,setWebSocket] = useState();
  function initScoresTable(){
    const REQUEST_FOR_UPDATING_SCORES = "http://localhost:8080/scores";
  axios
    .get(REQUEST_FOR_UPDATING_SCORES)
    .then(function (response) {
     
      const scores = response.data.data.scores;
      
     setScoresTable(scores)
    
    })
    .catch((error) => {
      console.log(error);
    });
  }
  function initWeb(){
  let  websocket2  = new WebSocket("ws://localhost:8080/scores-board");
  websocket2.onmessage = function (param) {
    var myobj = JSON.parse(param.data);
    setScoresTable(myobj);
   console.log(myobj)
  };
  websocket2.onerror = function (param) {
    console.log(param);
  };
  websocket2.onopen = () => {
    console.log("connected to " );
  };
  websocket2.onclose = () => {
    console.log("disconected from websocket");
  };
 setWebSocket(websocket2)
  
  }
  function doLogin() {
    axios
      .get(LOGIN_REQUEST, {
        params: {
          alias: alias,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          console.log(response.data.data.board);
          setBoard(response.data.data.board);

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
      initScoresTable()
      initWeb()

      
  }

  function goSetAlias(event) {
    setAlias(event.target.value);
  }

  return (
    <>
      <input onChange={goSetAlias}></input>
      <button onClick={doLogin}> Log in</button>
      {isLoggedIn ? (
        <BoardGame
          info={board.values}
          alias={alias}
          currentGameId={board.currentGameId}
          init = {initScores}
          websocketConn = {websocket}
        />
      ) : null}
      <ScoresTable scoresTable={scoresTable} />
    </>
  );
}

export default App;
