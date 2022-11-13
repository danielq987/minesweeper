import { MouseEvent, useEffect, useState } from "react";
import { Difficulty, GameStatus, Settings, SquareState } from "../helpers/types";
import {
  generateBoard,
  getImgString,
  getSurroundingMines,
  getNewBoardState,
  getSettingsFromDifficulty,
} from "../helpers/helpers";
import Square from "./Square";
interface FocusedSquare {
  x: number;
  y: number;
  isSurround: boolean;
}

interface Props {
  height: number;
  width: number;
  mines: number;
  status: GameStatus;
  setStatus: (status: GameStatus) => void;
}

const Game = (props: Props) => {

  const getInitialState = (width: number, height: number) => {
    return Array.from(Array(height), () =>
      new Array(width).fill(SquareState.Empty)
    );
  };

  const [boardState, setBoardState] = useState<SquareState[][]>(getInitialState(props.width, props.height));
  const [boardSolution, setBoardSolution] = useState<boolean[][]>(
    generateBoard(props.width, props.height, 0)
  );
  const [focusedSquare, setFocusedSquare] = useState<FocusedSquare | null>();
  const [firstClick, setFirstClick] = useState<number[] | undefined>();

  useEffect(() => {
    const x = firstClick && firstClick[0];
    const y = firstClick && firstClick[1];
    const solution = generateBoard(
      props.width,
      props.height,
      props.mines,
      x,
      y
    );
    setBoardSolution(solution);
    if (x && y) {
      setBoardState(
        getNewBoardState(SquareState.Open, x, y, boardState, solution)
      );
    }
  }, [firstClick]);

  useEffect(() => {
    setBoardState(getInitialState(props.width, props.height));
    setBoardSolution(generateBoard(props.width, props.height, 0));
    setFirstClick(undefined);
    props.setStatus(GameStatus.Starting);
  }, [props.width, props.height, props.mines]);


  const setSquareTo = (state: SquareState, x: number, y: number) => {
    setBoardState(getNewBoardState(state, x, y, boardState, boardSolution));
  };

  const handleMouse = (
    event: MouseEvent<HTMLImageElement>,
    x: number,
    y: number
  ) => {
    event.preventDefault();
    const squareState = boardState[y][x];
    if (props.status === GameStatus.Lost) return;

    switch (event.type) {
      case "contextmenu":
        if (squareState === SquareState.Empty) {
          setSquareTo(SquareState.Flag, x, y);
        } else if (squareState === SquareState.Flag) {
          setSquareTo(SquareState.Empty, x, y);
        }
        break;

      case "mouseup":
        if (squareState === SquareState.Empty && event.button === 0) {
          if (!firstClick) {
            // Game has not started yet
            setFirstClick([x, y]);
            props.setStatus(GameStatus.Playing);
          } else {
            setSquareTo(SquareState.Open, x, y);
            // Lost
            if (getSurroundingMines(boardSolution, x, y) === -1) props.setStatus(GameStatus.Lost);
          }
        }
        setFocusedSquare(null);
        break;

      case "mousedown":
        if (squareState === SquareState.Empty && event.button === 0) {
          setFocusedSquare({
            x,
            y,
            isSurround: false,
          });
        }
        break;

      case "mouseover":
        if (squareState === SquareState.Empty && event.buttons === 1) {
          setFocusedSquare({
            x,
            y,
            isSurround: false,
          });
        }
        break;

      default:
        break;
    }
  };

  // Debug flag
  const showBoardState = false;

  const getSquareState = (x: number, y: number): SquareState => {
    if (y >= boardState.length || x >= boardState[0].length) return SquareState.Empty;

    if (focusedSquare && focusedSquare.x === x && focusedSquare.y === y) {
      return SquareState.Focused;
    }

    return showBoardState
      ? boardSolution[y][x]
        ? SquareState.Flag
        : SquareState.Empty
      : boardState[y][x];
  };

  const dimensionsMatch = ():boolean => {
    return props.width === boardSolution[0].length && props.height === boardSolution.length
  }

  return (
    <div className="game-wrapper">
      {dimensionsMatch() && [...Array(props.height)].map((_: any, y) => {
        return (
          <div key={y} className="row">
            {[...Array(props.width)].map((_: any, x) => (
              <Square
                state={getSquareState(x, y)}
                key={x}
                getImgString={(state) =>
                  getImgString(state, () => getSurroundingMines(boardSolution, x, y))
                }
                handleMouse={(e) => handleMouse(e, x, y)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Game;
