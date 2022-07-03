import { FINISH_GAME_REQUEST, UPDATE_PRIZE_REQUEST } from "../routes/routes";
import axios from "axios";
import ScoresTable from "./ScoresTable";
import { useState } from "react";
import { PlayerGamesSummary } from "./PlayerGamesSummary";
import SockJsClient from "react-stomp";

export default function BoardGame(props) {
  const UPDATE_LETTERS_REQUEST = "http://localhost:8080/letters";
  const GET_SERVER_PROPOSED_LETTER_REQUEST =
    "http://localhost:8080/propose-letter/";
  const GET_CURRENT_USER_SCORE = "http://localhost:8080/games/";
  const UPDATE_USER_SCORE_REQUEST = "http://localhost:8080/score";
  const SOCKET_URL = "http://localhost:8080/gs-guide-websocket";
  var userScore = 100000;
  var userWon = -1;
  const [userLetter, setUserLetter] = useState();
  const [serverLetter, setServerLetter] = useState();
  const [points, setPoints] = useState(props.info[8]);
  const [stop, setStop] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [scoresTable, setScoresTable] = useState(props.init);
  const [userUpdateScore, setUserUpdateScore] = useState();
  const [stopInit, setStopInit] = useState(false);

  function requestScores() {
    const REQUEST_FOR_UPDATING_SCORES = "http://localhost:8080/scores";
    axios
      .get(REQUEST_FOR_UPDATING_SCORES)
      .then(function (response) {
        const scores = response.data.data.scores;
        const stringfied = JSON.stringify(scores);
        console.log("89890870   " + scores.length);
        props.websocketConn.send(stringfied);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function sendFinishSignal() {
    const REQUEST = FINISH_GAME_REQUEST + "/" + props.currentGameId + "/" + "1";
    axios
      .put(REQUEST)
      .then(function (response) {
        console.log(response);
        var millisecondsToWait = 1000;
        setTimeout(function () {
          // Whatever you want to do after the wait
        }, millisecondsToWait);
        requestScores();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function calculateScore() {
    let finalUserScore = 0;
    axios
      .get(GET_CURRENT_USER_SCORE + props.currentGameId)
      .then(function (response) {
        console.log(response);
        finalUserScore = response.data.data.game.score;
        const map1 = new Map();
        map1.set(props.info[0], parseInt(props.info[1]));
        map1.set(props.info[2], parseInt(props.info[3]));
        map1.set(props.info[4], parseInt(props.info[5]));
        map1.set(props.info[6], parseInt(props.info[7]));
        console.log("MAPS--", map1);
        if (userLetter != serverLetter) {
          if (map1.get(userLetter) > map1.get(serverLetter)) {
            finalUserScore = map1.get(userLetter) + map1.get(serverLetter);
          } else {
            if (map1.get(userLetter) < map1.get(serverLetter)) {
              finalUserScore = finalUserScore - map1.get(userLetter);
            }
          }
          console.log("finalScores", finalUserScore);
          setUserUpdateScore(finalUserScore);
          axios
            .put(UPDATE_USER_SCORE_REQUEST, {
              playerAlias: props.alias,
              playerScore: finalUserScore,
              playerLetters: "",
              currentGameId: props.currentGameId,
            })
            .then(function (response) {})
            .catch((error) => {
              console.log(error);
            });
          setPoints(finalUserScore);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function userPickedLetter(letter, letterValue) {
    setUserLetter(letter);

    axios
      .put(UPDATE_LETTERS_REQUEST, {
        playerAlias: props.alias,
        playerScore: points,
        playerLetters: letter,
        currentGameId: props.currentGameId,
      })
      .then(function (response) {})
      .catch((error) => {
        console.log(error);
      });
  }
  function getServerLetter() {
    if (clicks < 3) {
      let letterString =
        props.info[0] + props.info[2] + props.info[4] + props.info[6];
      axios
        .get(GET_SERVER_PROPOSED_LETTER_REQUEST + letterString)
        .then(function (response) {
          setServerLetter(response.data.data.proposed);
          calculateScore();
          setPoints(userUpdateScore);
        })
        .catch((error) => {
          console.log(error);
        });

      setClicks(clicks + 1);
    }
    if (clicks == 3) {
      //alert("Game over");
      console.log("Game over");
      calculateScore();
      setPoints(userUpdateScore);
      sendFinishSignal();

      setStop(true);
    }
  }

  return (
    <>
      <div>
        <p>Points : {points}</p>

        <p>Letters:</p>
        <button
          onClick={() => {
            userPickedLetter(props.info[0], parseInt(props.info[1]));
          }}
        >
          1.{props.info[0]} : {props.info[1]}
        </button>
        <button
          onClick={() => {
            userPickedLetter(props.info[2], parseInt(props.info[3]));
          }}
        >
          2.{props.info[2]} : {props.info[3]}
        </button>
        <button
          onClick={() => {
            userPickedLetter(props.info[4], parseInt(props.info[5]));
          }}
        >
          3.{props.info[4]} : {props.info[5]}
        </button>
        <button
          onClick={() => {
            userPickedLetter(props.info[6], parseInt(props.info[7]));
          }}
        >
          4.{props.info[6]} : {props.info[7]}
        </button>

        <button onClick={getServerLetter}>Server letter</button>
        <p>Server proposed letter:{serverLetter}</p>
        <p>User proposed letter:{userLetter}</p>

        {/* {!stop ? <ScoresTable scoresTable={scoresTable} /> : null} */}
      </div>
    </>
  );
}
