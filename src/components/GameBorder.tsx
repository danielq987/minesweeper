import { ReactElement, ReactInstance } from "react";
import { imgPath } from "../helpers/helpers";
import BorderElement from "./BorderElement";

interface Props {
  width: number;
  height: number;
  mineDisplay: ReactElement;
  timer: ReactElement;
  smiley: ReactElement;
  children: ReactElement;
}

const GameBorder = (props: Props) => {
  return (
    <>
      <div className="row">
        <BorderElement path={imgPath("ul-border.svg")} isCorner />
        <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
        <BorderElement path={imgPath("ur-border.svg")} isCorner />
      </div>
      <div className="row header">
        <div className="row">
          <div className="border-column">
            <BorderElement repeat={2} path={imgPath("v-border.svg")} />
          </div>
          {props.mineDisplay}
        </div>
        {props.smiley}
        <div className="row">
          {props.timer}
          <div className="border-column">
            <BorderElement repeat={2} path={imgPath("v-border.svg")} />
          </div>
        </div>
      </div>
      <div className="row">
        <BorderElement path={imgPath("lt-border.svg")} isCorner />
        <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
        <BorderElement path={imgPath("rt-border.svg")} isCorner />
      </div>
      <div className="row">
        <div className="border-column">
          <BorderElement repeat={props.height} path={imgPath("v-border.svg")} />
        </div>
        {props.children}
        <div className="border-column">
          <BorderElement repeat={props.height} path={imgPath("v-border.svg")} />
        </div>
      </div>
      <div className="row">
        <BorderElement path={imgPath("dl-border.svg")} isCorner />
        <BorderElement repeat={props.width} path={imgPath("h-border.svg")} />
        <BorderElement path={imgPath("dr-border.svg")} isCorner />
      </div>
    </>
  );
};

export default GameBorder;
