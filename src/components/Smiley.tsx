import { useState } from "react";
import { imgPath } from "../helpers/helpers";
import { GameStatus } from "../helpers/types";

interface Props {
	status: GameStatus,
	setStatus: (status: GameStatus) => void
}

const Smiley = (props: Props) => {
	const [pressed, setPressed] =  useState<boolean>(false);

	const handleClick = () => {
		props.setStatus(GameStatus.Starting)
		setPressed(false);
	}

	const handleMouseDown = () => {
		setPressed(true);
	}

	let src = "happy.svg";

	switch (props.status) {
		case GameStatus.Starting:
		case GameStatus.Playing:
			src = "happy.svg";
			break;
	
		case GameStatus.Lost:
			src = "dead.svg"
			break;

		case GameStatus.Won:
			src = "sunglasses.svg"
			break;

	}

	return <img alt="Smiley!" src={imgPath(pressed ? "happy-pressed.svg" : src)} className="smiley" onClick={handleClick} onMouseDown={handleMouseDown}/>
}

export default Smiley;