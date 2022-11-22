import { useEffect, useState } from "react";
import { GameStatus } from "../helpers/types";
import Board from "./Board";
import Smiley from "./Smiley";
import DigitDisplay from "./DigitDisplay";
import io from "socket.io-client";
import GameBorder from "./GameBorder";

const socket = io();

interface Props {
  height: number;
  width: number;
  mines: number;
}

const Game = (props: Props) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Starting);
  const [time, setTime] = useState<number>(0);
  const [remainingMines, setRemainingMines] = useState<number>(props.mines);

  // socketio shenanigans
  const [iscConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    setGameStatus(GameStatus.Starting);
    setRemainingMines(props.mines);
  }, [props.width, props.height, props.mines]);

  useEffect(() => {
    console.log("using effect ");
    let timer: NodeJS.Timer;
    const stopTimer = () => {
      clearInterval(timer);
    };

    const resetTimer = () => {
      setTime(0);
    };

    const startTimer = () => {
      timer = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    };

    switch (gameStatus) {
      case GameStatus.Lost:
      case GameStatus.Won:
        stopTimer();
        break;

      case GameStatus.Starting:
        resetTimer();
        setRemainingMines(props.mines);
        break;

      case GameStatus.Playing:
        startTimer();
        break;
    }
    return stopTimer;
  }, [time, gameStatus]);

  return (
    <div className="game-wrapper">
      <GameBorder
        width={props.width}
        height={props.height}
        mineDisplay={<DigitDisplay num={remainingMines} />}
        smiley={<Smiley status={gameStatus} setStatus={setGameStatus} />}
        timer={<DigitDisplay num={time} />}
      >
        <Board
          width={props.width}
          height={props.height}
          mines={props.mines}
          setStatus={(status) => setGameStatus(status)}
          status={gameStatus}
          remainingMines={remainingMines}
          setRemainingMines={setRemainingMines}
        />
      </GameBorder>
    </div>
  );
};

export default Game;
