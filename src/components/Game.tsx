import { MouseEvent, useEffect, useState } from "react";
import { GameStatus, SquareState } from "../helpers/types";
import {
  generateBoard,
  getImgString,
  getSurroundingMines,
  getNewBoardState,
  makeArray,
  imgPath,
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
    if (x && y) {
      setBoardState(
        getNewBoardState(SquareState.Open, x, y, boardState, solution)
      );
    }
  }, [firstClick]);

  useEffect(() => {
    setBoardState(getInitialState(props.width, props.height));
    setBoardSolution(generateBoard({ width, height, mines: 0 }));
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
            if (getSurroundingMines(boardSolution, x, y) === -1)
              props.setStatus(GameStatus.Lost);
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

  // Check to make sure state (board) is updated according to the props.
  const dimensionsMatch = (): boolean => {
    return (
      props.width === boardSolution[0].length &&
      props.height === boardSolution.length
    );
  };

  return (
    <div className="game-wrapper">
      {dimensionsMatch() && (
        <>
          <div className="row">
            <img src={imgPath("ul-border.svg")} className="border corner-border"/>
            {[...Array(props.width)].map((_: any, index) => {
              return <img src={imgPath("h-border.svg")} className="border"/>
            })}
            <img src={imgPath("ur-border.svg")} className="border corner-border"/>
          </div>
          <div className="row">
            <img src={imgPath("lt-border.svg")} className="border corner-border"/>
            {[...Array(props.width)].map((_: any, index) => {
              return <img src={imgPath("h-border.svg")} className="border"/>
            })}
            <img src={imgPath("rt-border.svg")} className="border corner-border"/>
          </div>
          {[...Array(props.height)].map((_: any, y) => {
            return (
              <div key={y} className="row">
                <img src={imgPath("v-border.svg")} className="border"></img>
                {[...Array(props.width)].map((_: any, x) => (
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
                <img src={imgPath("v-border.svg")} className="border"></img>
              </div>
            );
          })}
          <div className="row">
            <img src={imgPath("dl-border.svg")} className="border corner-border"/>
            {[...Array(props.width)].map((_: any, index) => {
              return <img src={imgPath("h-border.svg")} className="border"/>
            })}
            <img src={imgPath("dr-border.svg")} className="border corner-border"/>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
