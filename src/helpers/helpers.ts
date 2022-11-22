import { Difficulty, Settings, SquareState } from "./types";

// lmao fix this shit
export const imgPath = (path: string): string =>
  `${process.env.PUBLIC_URL}/img/${path}`;

export const isNeighbour = (x1: number, y1: number, x2: number, y2: number): boolean => {
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1
}

const pairToString = (xPos: number, yPos: number): string => {
  return `${xPos}_${yPos}`;
};


export const getNeighbours = (
  xPos: number,
  yPos: number,
  xMax: number,
  yMax: number
): number[][] => {
  let neighbours = [];
  for (let y = Math.max(0, yPos - 1); y < Math.min(yMax, yPos + 2); y++) {
    for (let x = Math.max(0, xPos - 1); x < Math.min(xMax, xPos + 2); x++) {
      if (x === xPos && y === yPos) continue;
      neighbours.push([x, y]);
    }
  }
  return neighbours;
};

export const getSurroundingCount = <Type>(
  board: Type[][],
  xPos: number,
  yPos: number,
  value: Type
): number => {
  let num_neighbours = 0;
  const xMax = board[0].length;
  const yMax = board.length;
  for (let neighbour of getNeighbours(xPos, yPos, xMax, yMax)) {
    const x = neighbour[0];
    const y = neighbour[1];
    if (board[y][x] === value) num_neighbours++;
  }
  return num_neighbours;
};


type ImgMap = {
  [key in SquareState]: string;
};

const imgs: ImgMap = {
  [SquareState.Empty]: "unpressed.svg",
  [SquareState.Flag]: "flag.svg",
  [SquareState.Open]: "mine.svg",
  [SquareState.Mine]: "mine-clicked.svg",
  [SquareState.Focused]: "0.svg",
  [SquareState.FlagIncorrect]: "mine-incorrect.svg",
};

export const getImgString = (
  state: SquareState,
  numNeighbours: () => number,
  isMine: () => boolean,
): string => {
  if (!isMine() && state === SquareState.Open)
    return imgPath(`${numNeighbours()}.svg`);

  return imgPath(imgs[state]);
};

// Fisher yates shuffle
function shuffle(array: number[]): number[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Fill a 2d array with value and return
export const makeArray = <Type>(xDim: number, yDim: number, value: Type):Type[][]  => {
  return Array.from(Array(yDim), () => new Array(xDim).fill(value));
};

export const generateBoard = (
  board: Settings,
  xClick = -2,
  yClick = -2
): boolean[][] => {
  const { height, width, mines } = board;
  if (mines > width * height) {
    throw new Error("Too many mines, idiot!");
  }

  let boardArray = makeArray(width, height, false);
  if (mines === 0) return boardArray;

  const mineArray = shuffle(
    [...Array(width * height)].map((_: any, index) => index)
  );

  let minesSet = 0;
  let mineIndex = 0;

  while (minesSet < mines) {
    const y = Math.floor(mineArray[mineIndex] / width);
    const x = mineArray[mineIndex] % width;

    mineIndex++;
    if (isNeighbour(x, y, xClick, yClick)) continue;

    boardArray[y][x] = true;
    minesSet++;
  }
  return boardArray;
};

// Returns the new board state, if [x, y] was replaced with state.
export const getNewBoardState = (
  state: SquareState,
  positions: number[][],
  currentState: SquareState[][],
  boardSolution: boolean[][]
) => {
  const visited = new Set();
  const xMax = currentState[0].length;
  const yMax = currentState.length;

  // Recursively open up squares
  const openSquare = (xPos: number, yPos: number) => {
    const str = pairToString(xPos, yPos);
    if (visited.has(str)) return;
    stateClone[yPos][xPos] = SquareState.Open;
    visited.add(str);
    if (getSurroundingCount(boardSolution, xPos, yPos, true) === 0) {
      for (let neighbour of getNeighbours(xPos, yPos, xMax, yMax)) {
        const x = neighbour[0];
        const y = neighbour[1];
        if (!visited.has(pairToString(x, y))) {
          openSquare(x, y);
        }
      }
    }
  };

  let stateClone = currentState.map((row) => row.slice());

  for (let [xPos, yPos] of positions) {
    if (state === SquareState.Open) {
      if (currentState[yPos][xPos] === SquareState.Empty)
        if (boardSolution[yPos][xPos]) {
          stateClone[yPos][xPos] = SquareState.Mine;
        } else {
          openSquare(xPos, yPos);
        }
    } else {
      stateClone[yPos][xPos] = state;
    }
  }

  return stateClone;
};

type SettingsMap = {
  [key in Difficulty]: Settings;
};

const settings: SettingsMap = {
  [Difficulty.Easy]: {
    width: 9,
    height: 9,
    mines: 10,
  },
  [Difficulty.Medium]: {
    width: 16,
    height: 16,
    mines: 40,
  },
  [Difficulty.Difficult]: {
    width: 30,
    height: 16,
    mines: 99,
  },
};

export const getSettingsFromDifficulty = (difficulty: Difficulty): Settings => {
  return settings[difficulty];
};
