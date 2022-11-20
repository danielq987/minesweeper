import { MouseEvent, useEffect, useMemo, useState } from "react";
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

  // Get list of mines
  const mineSet: number[][] = useMemo(() => {
    const s: number[][] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (boardSolution[y][x]) {
          s.push([x, y]);
        }
      }
    }
    return s;
  }, [boardSolution])

  // Returns true if game end
  const checkGameWin = (updatedBoard: SquareState[][]) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // If not a mine and the square is not open -
        if (!boardSolution[y][x] && updatedBoard[y][x] !== SquareState.Open) {
          return false;
        }
      }
    }
    return true;
  };

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

  // Returns false if user opens a bomb
  const setSquaresTo = (state: SquareState, positions: number[][]): boolean => {
    const newBoard = getNewBoardState(
      state,
      positions,
      boardState,
      boardSolution
    );
    setBoardState(newBoard);
    if (state === SquareState.Open) {
      if (checkGameWin(newBoard)) {
        props.setStatus(GameStatus.Won);
        setBoardState(getNewBoardState(SquareState.Flag, mineSet, newBoard, boardSolution));
      } else {
        props.setStatus(GameStatus.Playing);
      }
      // Check if one of the opened squares is a bomb
      for (let position of positions) {
        const [x, y] = position;
        if (boardSolution[y][x] && boardState[y][x] === SquareState.Empty) {
          console.log("checking bomb");
          props.setStatus(GameStatus.Lost);
          return false;
        }
      }
    }
    return true;
  };

  const handleMouse = (
    event: MouseEvent<HTMLImageElement>,
    x: number,
    y: number
  ) => {
    event.preventDefault();
    const squareState = boardState[y][x];
    if (props.status === GameStatus.Lost || props.status === GameStatus.Won)
      return;

    switch (event.type) {
      case "contextmenu":
        if (squareState === SquareState.Empty && props.remainingMines > 0) {
          setSquaresTo(SquareState.Flag, [[x, y]]);
          props.setRemainingMines(props.remainingMines - 1);
        } else if (squareState === SquareState.Flag) {
          setSquaresTo(SquareState.Empty, [[x, y]]);
          props.setRemainingMines(props.remainingMines + 1);
        }
        break;

      case "mouseup":
        const isDoubleClick =
          (event.button === 2 && event.buttons === 1) ||
          (event.button === 0 && event.buttons === 2);
        let status = GameStatus.Playing;
        if (squareState === SquareState.Empty && event.button === 0) {
          if (!firstClick) {
            // Game has not started yet
            setFirstClick([x, y]);
            props.setStatus(GameStatus.Playing);
          } else {
            setSquaresTo(SquareState.Open, [[x, y]]);
          }
        } else if (squareState === SquareState.Open && isDoubleClick) {
          const surroundingFlags = getSurroundingFlags(boardState, x, y);
          const surroundingMines = getSurroundingMines(boardSolution, x, y);

          if (surroundingMines > 0 && surroundingFlags === surroundingMines) {
            setSquaresTo(
              SquareState.Open,
              getNeighbours(x, y, cWidth, cHeight)
            );
          }
        }
        setFocusedSquare(null);
        break;

      case "mousedown":
        if (squareState === SquareState.Empty && event.button === 0) {
          props.setStatus(GameStatus.Pressing);
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

    if (props.status === GameStatus.Lost) {
      const squareState = boardState[y][x];
      const solution = boardSolution[y][x];
      if (solution && squareState === SquareState.Empty) {
        return SquareState.Open;
      } else if (squareState === SquareState.Flag && !solution) {
        return SquareState.FlagIncorrect;
      }
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
