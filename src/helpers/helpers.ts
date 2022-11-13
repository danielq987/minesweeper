import { Difficulty, Settings, SquareState } from "./types";

// lmao fix this shit
const rootPath = "/~d3qu/build"

const pairToString = (xPos: number, yPos: number): string => {
	return `${xPos}_${yPos}`
}

const getNeighbours = (xPos: number, yPos: number, xMax: number, yMax: number): number[][] => {
	let neighbours = []
	for (let y = Math.max(0, yPos - 1); y < Math.min(yMax, yPos + 2); y++) {
		for (let x = Math.max(0, xPos - 1); x < Math.min(xMax, xPos + 2); x++) {
			if (x === xPos && y === yPos) continue;
			neighbours.push([x, y]);
		}
	}
	return neighbours;
}

export const getSurroundingMines = (
	boardSolution: boolean[][],
	xPos: number,
	yPos: number,
): number => {
	// This is a mine
	if (boardSolution[yPos][xPos]) return -1;
	let num_neighbours = 0;

	const xMax = boardSolution[0].length;
	const yMax = boardSolution.length;
	for (let neighbour of getNeighbours(xPos, yPos, xMax, yMax)) {
		const x = neighbour[0];
		const y = neighbour[1];
		if (boardSolution[y][x]) num_neighbours++;
	}
	return num_neighbours;
};

export const getImgString = (
	state: SquareState,
	numNeighbours: () => number,
): string => {
	switch (state) {
		case SquareState.Empty:
			return `${rootPath}/img/unpressed.svg`;

		case SquareState.Flag:
			return `${rootPath}/img/flag.svg`;

		case SquareState.Open:
			if (numNeighbours() < 0) return "/img/mine.svg";
			return `${rootPath}/img/${numNeighbours()}.svg`;

		case SquareState.Focused:
			return `${rootPath}/img/0.svg`;
	}
};

// Fisher yates shuffle
function shuffle(array: number[]): number[] {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

export const generateBoard = (xDim: number, yDim: number, numMines = 0, xClick = -2, yClick = -2): boolean[][] => {
	if (numMines > xDim * yDim) {
		throw new Error("Too many mines, idiot!");
	}

	let boardArray = Array.from(Array(yDim), () => new Array(xDim).fill(false))

	if (numMines === 0) return boardArray;

	const mineArray = shuffle([...Array(xDim * yDim)].map((_: any, index) => index));

	let minesSet = 0;
	let mineIndex = 0;

	while (minesSet < numMines) {
		const y = Math.floor(mineArray[mineIndex] / xDim);
		const x = mineArray[mineIndex] % xDim;

		mineIndex++;
		// Janky way to make sure the squares around the click location are not mines
		if (Math.abs(xClick - x) <= 1 && Math.abs(yClick - y) <= 1) continue;

		boardArray[y][x] = true;
		minesSet++;
	}
	return boardArray;
}


export const getNewBoardState = (state: SquareState, x: number, y: number, currentState: SquareState[][], boardSolution: boolean[][]) => {
	const visited = new Set();
	const xMax = currentState[0].length;
	const yMax = currentState.length;
	console.log(boardSolution)

	// Recursively open up squares
	const openSquare = (xPos: number, yPos: number) => {
		stateClone[yPos][xPos] = SquareState.Open;
		visited.add(pairToString(xPos, yPos));
		console.log(getSurroundingMines(boardSolution, xPos, yPos))
		if (getSurroundingMines(boardSolution, xPos, yPos) === 0) {
			for (let neighbour of getNeighbours(xPos, yPos, xMax, yMax)) {
				const x = neighbour[0];
				const y = neighbour[1];
				if (!visited.has(pairToString(x, y))) {
					openSquare(x, y);
				}
			}
		}
	}

	let stateClone = currentState.map((row) => row.slice());
	if (state === SquareState.Open) {
		openSquare(x, y)
	}
	else {
		stateClone[y][x] = state;
	}

	return stateClone
}

type SettingsMap = {
	[key in Difficulty]: Settings
}

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
}

export const getSettingsFromDifficulty = (difficulty: Difficulty): Settings => {
	return settings[difficulty];
}