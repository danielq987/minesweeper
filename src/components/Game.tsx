import React, { useEffect, useRef } from "react";

interface Props {}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {}, []);

  return <canvas id="canvas" ref={canvasRef}></canvas>;
};

export default Game;
