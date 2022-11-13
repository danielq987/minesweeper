import { MouseEvent, useEffect } from "react";
import { SquareState } from "../helpers/types";

interface Props {
  state: SquareState;
  getImgString: (state: SquareState) => string;
  handleMouse: (e: MouseEvent<HTMLImageElement>) => void;
}

const Square = (props: Props) => {
  useEffect(() => {}, []);

  return (
    <img
      src={props.getImgString(props.state)}
      className="square"
      onMouseDown={props.handleMouse}
      onMouseUp={props.handleMouse}
      onMouseOver={props.handleMouse}
      onContextMenu={props.handleMouse}
      draggable={false}
      alt=""
    />
  );
};

export default Square;
