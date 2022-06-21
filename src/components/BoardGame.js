import { FINISH_GAME_REQUEST, UPDATE_PRIZE_REQUEST } from "../routes/routes";
import axios from "axios";
import ScoresTable from "./ScoresTable";
import { useState } from "react";
import { PlayerGamesSummary } from "./PlayerGamesSummary";


export default function BoardGame(props) {

  var clicks = 0;
var userScore = 100000;
var userWon = -1;

const [stop,setStop] = useState(false);
function sendFinishSignal(){
    const REQUEST = FINISH_GAME_REQUEST +  "/" + props.currentGameId + "/" + "1"
    axios.put(REQUEST)
    .then(function (response) {
      console.log(response);
     
    })
    .catch((error) => {
      console.log(error);
    });


}

function check(row, col, win) {
    
  if (clicks < 3) {
    clicks = clicks + 1;
    let linwin = win.info[0];
    let colwin = win.info[1];
    userScore = Math.sqrt(
      (linwin - row) * (linwin - row) + (colwin - col) * (colwin - col)
    );
       
    if (row == linwin && col == colwin) {
      alert("you won");
      userWon = win.info[2];
      setStop(true);
      sendFinishSignal();
    }
    axios
      .put(UPDATE_PRIZE_REQUEST, {
        playerAlias: win.alias,
        playerScore: userScore,
        playerPrize: userWon,
        currentGameId : win.currentGameId
      })
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (clicks == 3) {
    alert("Game Over");
    clicks = clicks + 1;
    if(!stop){
      sendFinishSignal();
    }
    setStop(true);
    
  }
}





  return (
    <>
      <div>
        <table>
          <tr>
            <td onClick={() => check(0, 0, props)}>*</td>
            <td onClick={() => check(0, 1, props)}>*</td>
            <td onClick={() => check(0, 2, props)}>*</td>
          </tr>

          <tr>
            <td onClick={() => check(1, 0, props)}>*</td>
            <td onClick={() => check(1, 1, props)}>*</td>
            <td onClick={() => check(1, 2, props)}>*</td>
          </tr>

          <tr>
            <td onClick={() => check(2, 0, props)}>*</td>
            <td onClick={() => check(2, 1, props)}>*</td>
            <td onClick={() => check(2, 2, props)}>*</td>
          </tr>
        </table>

        {!stop ? <ScoresTable /> : null}
        {stop ? <PlayerGamesSummary playerAlias = {props.alias} />:null}
      </div>
    </>
  );
}
