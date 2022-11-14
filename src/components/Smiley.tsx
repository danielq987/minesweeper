import { useState } from "react";
import { imgPath } from "../helpers/helpers";
import { GameStatus } from "../helpers/types";

interface Props {
	restartGame: () => void,
	status: GameStatus
}

const Smiley = (props: Props) => {
	const [src, setSrc] =  useState<string>("happy.svg");

	const handleClick = () => {
		props.restartGame();
		setSrc("happy.svg");
	}
	const handleMouseDown = () => {
		setSrc("happy-pressed.svg");
	}

	return <img alt="Smiley!" src={imgPath(src)} className="smiley" onClick={handleClick} onMouseDown={handleMouseDown}/>
}

export default Smiley;