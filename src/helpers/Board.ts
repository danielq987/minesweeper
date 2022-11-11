
enum SquareState {
	Empty,
	Flag,
	Open
};

class Board {
	_xDim: number;
	_yDim: number;
	_numMines: number;
	_board: SquareState[][];

	constructor(xDim: number, yDim: number, numMines: number) {
		this._xDim = xDim;
		this._yDim = yDim;
		this._numMines = numMines;
		this._board = [];

		const row = Array(xDim).fill(SquareState.Empty);
		this._board = Array(yDim).fill(row);
	}
}

export default Board;