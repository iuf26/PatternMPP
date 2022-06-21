import { GLOBAL_SCORES_REQUEST } from "../routes/routes";
import { useEffect, useState } from "react";
import GameInfo from "./GameInfo";
export default function ScoresTable() {
  const [gameScores, setGameScores] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${GLOBAL_SCORES_REQUEST}`, { method: "GET" })
        .then((response) => response.json())
        .then((response) => {
          setGameScores(response.data.scores);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {});
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <p>Top Global scores:</p>
        <br></br>
        {gameScores.map((game, gameIndex) => {
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
