import React, { useEffect, useRef } from "react";
import Board from "../helpers/Board";

interface Props {}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clickListener = () => {
    console.log("clicked");
  };

  useEffect(() => {
		const getCursorPosition = (event: MouseEvent) => {
			const rect = canvas!.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			console.log("x: " + x + " y: " + y);
		};

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		let p = new Path2D()
		let img = new Image();

		img.onload = () => {
			ctx.drawImage(img, 0, 0);
		}
		img.src = "/img/1.svg"

    canvas.addEventListener("click", getCursorPosition);

    return () => {
      canvas.removeEventListener("click", getCursorPosition);
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef}></canvas>;
};

export default Canvas;
