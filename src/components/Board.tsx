import { MouseEvent, useEffect, useState } from "react";
import { GameStatus, SquareState } from "../helpers/types";
import {
  generateBoard,
  getImgString,
  getSurroundingMines,
  getNewBoardState,
  makeArray,
  getSurroundingFlags,
  getNeighbours,
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
  remainingMines: number;
  setRemainingMines: (mines: number) => void;
}

const Game = (props: Props) => {
  const { height, width, mines } = props;
  const getInitialState = (width: number, height: number) => {
    return makeArray(width, height, SquareState.Empty);
  };

  const [boardState, setBoardState] = useState<SquareState[][]>(
    getInitialState(props.width, props.height)
  );
  const [boardSolution, setBoardSolution] = useState<boolean[][]>(
    generateBoard({ width, height, mines: 0 })
  );
  const [focusedSquare, setFocusedSquare] = useState<FocusedSquare | null>();
  const [firstClick, setFirstClick] = useState<number[] | undefined>();

  useEffect(() => {
    const x = firstClick && firstClick[0];
    const y = firstClick && firstClick[1];
    const solution = generateBoard({ height, width, mines }, x, y);
    setBoardSolution(solution);
    if (x !== undefined && y !== undefined) {
      setBoardState(
        getNewBoardState(SquareState.Open, [[x, y]], boardState, solution)
      );
    }
  }, [firstClick]);

  useEffect(() => {
    if (props.status === GameStatus.Starting) {
      setBoardState(getInitialState(width, height));
      setBoardSolution(generateBoard({ width, height, mines: 0 }));
      setFirstClick(undefined);
      props.setStatus(GameStatus.Starting);
    }
  }, [width, height, mines, props]);

  const setSquareTo = (state: SquareState, positions: number[][]) => {
    setBoardState(
      getNewBoardState(state, positions, boardState, boardSolution)
    );
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
          setSquareTo(SquareState.Flag, [[x, y]]);
          props.setRemainingMines(props.remainingMines - 1);
        } else if (squareState === SquareState.Flag) {
          setSquareTo(SquareState.Empty, [[x, y]]);
          props.setRemainingMines(props.remainingMines + 1);
        }
        break;

      case "mouseup":
        const isDoubleClick =
          (event.button === 2 && event.buttons === 1) ||
          (event.button === 0 && event.buttons === 2);
        if (squareState === SquareState.Empty && event.button === 0) {
          if (!firstClick) {
            // Game has not started yet
            setFirstClick([x, y]);
            props.setStatus(GameStatus.Playing);
          } else {
            setSquareTo(SquareState.Open, [[x, y]]);
            // Lost
            if (getSurroundingMines(boardSolution, x, y) === -1)
              props.setStatus(GameStatus.Lost);
          }
        } else if (squareState === SquareState.Open && isDoubleClick) {
          const surroundingFlags = getSurroundingFlags(boardState, x, y);
          const surroundingMines = getSurroundingMines(boardSolution, x, y);

          if (surroundingMines > 0 && surroundingFlags === surroundingMines) {
            setSquareTo(SquareState.Open, getNeighbours(x, y, cWidth, cHeight));
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

  const getSquareState = (x: number, y: number): SquareState => {
    if (y >= boardState.length || x >= boardState[0].length)
      return SquareState.Empty;

    if (focusedSquare && focusedSquare.x === x && focusedSquare.y === y) {
      return SquareState.Focused;
    }

    return boardState[y][x];
  };

  // Calculated dimensions
  const cWidth = boardSolution[0].length;
  const cHeight = boardSolution.length;

  return (
    <div className="game-wrapper">
      <>
        {[...Array(cHeight)].map((_: any, y) => {
          return (
            <div key={y} className="row">
              {[...Array(cWidth)].map((_: any, x) => (
                <Square
                  state={getSquareState(x, y)}
                  key={x}
                  getImgString={(state) =>
                    getImgString(state, () =>
                      getSurroundingMines(boardSolution, x, y)
                    )
                  }
                  handleMouse={(e) => handleMouse(e, x, y)}
                />
              ))}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default Game;
