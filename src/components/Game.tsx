import { useEffect, useState } from "react";
import { imgPath } from "../helpers/helpers";
import { GameStatus } from "../helpers/types";
import BorderElement from "./BorderElement";
import Board from "./Board";
import Smiley from "./Smiley";
import DigitDisplay from "./DigitDisplay";

interface Props {
  height: number;
  width: number;
  mines: number;
}

const Game = (props: Props) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Starting);
  const [time, setTime] = useState<number>(0);
  const [remainingMines, setRemainingMines] = useState<number>(props.mines);
  const game = (
    <Board
      width={props.width}
      height={props.height}
      mines={props.mines}
      setStatus={(status) => setGameStatus(status)}
      status={gameStatus}
      remainingMines={remainingMines}
      setRemainingMines={setRemainingMines}
    />
  );

  useEffect(() => {
    setGameStatus(GameStatus.Starting);
    setRemainingMines(props.mines);
  }, [props.width, props.height, props.mines])

  useEffect(() => {
    let timer: NodeJS.Timer;
    const stopTimer = () => {
      clearInterval(timer);
    };

    const resetTimer = () => {
      setTime(0);
    };

    const startTimer = () => {
      timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);
    };

    switch (gameStatus) {
      case GameStatus.Lost:
      case GameStatus.Won:
        stopTimer();
        break;

      case GameStatus.Starting:
        resetTimer();
        setRemainingMines(props.mines)
        break;

      case GameStatus.Playing:
      case GameStatus.Pressing:
        startTimer();
        break;
    }
    return stopTimer;
  }, [time, gameStatus]);

  return (
    <div className="game-wrapper">
      <>
        <div className="row">
          <BorderElement path={imgPath("ul-border.svg")} isCorner />
          <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
          <BorderElement path={imgPath("ur-border.svg")} isCorner />
        </div>
        <div className="row header">
          <div className="row">
            <div className="border-column">
              <BorderElement repeat={2} path={imgPath("v-border.svg")} />
            </div>
            <DigitDisplay num={remainingMines} />
          </div>
          <Smiley
            status={gameStatus}
            setStatus={setGameStatus}
          />
          <div className="row">
            <DigitDisplay num={time} />
            <div className="border-column">
              <BorderElement repeat={2} path={imgPath("v-border.svg")} />
            </div>
          </div>
        </div>
        <div className="row">
          <BorderElement path={imgPath("lt-border.svg")} isCorner />
          <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
          <BorderElement path={imgPath("rt-border.svg")} isCorner />
        </div>
        <div className="row">
          <div className="border-column">
            <BorderElement
              repeat={props.height}
              path={imgPath("v-border.svg")}
            />
          </div>
          {game}
          <div className="border-column">
            <BorderElement
              repeat={props.height}
              path={imgPath("v-border.svg")}
            />
          </div>
        </div>
        <div className="row">
          <BorderElement path={imgPath("dl-border.svg")} isCorner />
          <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
          <BorderElement path={imgPath("dr-border.svg")} isCorner />
        </div>
      </>
    </div>
  );
};

export default Game;
