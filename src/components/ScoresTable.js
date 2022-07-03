import { GLOBAL_SCORES_REQUEST } from "../routes/routes";
import { useEffect, useState } from "react";
import GameInfo from "./GameInfo";
import axios from "axios";
export default function ScoresTable(props) {
  const [gameScores, setGameScores] = useState([]);

 

  return (
    <>
      <div>
        <p>Top Global scores:</p>
        <br></br>
        {props.scoresTable.map((game, gameIndex) => {
          return (
            <GameInfo
              details={{
                prize: game.prize,
                player: game.playerAlias,
                score: game.score,
                gameDate : game.beginTime,
                rank: gameIndex + 1
              }}
            ></GameInfo>
          );
        })}
      </div>
    </>
  );
}
