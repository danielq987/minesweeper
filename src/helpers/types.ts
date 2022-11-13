export enum SquareState {
	Empty,
	Flag,
	Focused,
	Open
};

export enum Difficulty {
	Easy,
	Medium,
	Difficult
}

export enum GameStatus {
	Playing,
	Lost,
	Won,
	Starting
}

export interface Settings {
	width: number;
	height: number;
	mines: number;
}