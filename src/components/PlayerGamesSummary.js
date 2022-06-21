import axios from "axios";
import { useState } from "react";
import { GLOBAL_SCORES_REQUEST } from "../routes/routes";
import GameInfo from "./GameInfo";
export const PlayerGamesSummary = (props) => {
  const GAMES_SUMMARY_REQUEST = "http://localhost:8080/score"; //trebuie adaugat aliasul player-ului
  //list of elements of Type Game
    const [playerGames,setPlayerGames] = useState([])
    const [stop,setStop]  = useState(false);
  function fetchFinishedGameSummary() {
    if(!stop){
    let playerAlias = props.playerAlias;
    
    axios
      .get(GLOBAL_SCORES_REQUEST)
      .then(function (response) {
        console.log(response);
       setPlayerGames (response.data.data.scores);
      })
      .catch((error) => {
        console.log(error);
      });
     setStop(true)
    }
  }

  fetchFinishedGameSummary();

  return (
    <>
      <div>
        Final ranks:
        <br></br>
        {
        playerGames.map((game,gameIndex) => {
          let inBolt = false;
          if(game.id == props.finishedGameId)
              inBolt = true;
          return (
            <GameInfo
              details={{
                prize: game.prize,
                player: game.playerAlias,
                score: game.score,
                gameDate : game.beginTime,
                rank : gameIndex + 1
              }}
            ></GameInfo>
          );
        })}
      </div>
    </>
  );
};
