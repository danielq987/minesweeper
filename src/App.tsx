import "./App.css";
import "./Game.css";
import Game from "./components/Game";
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { Difficulty, GameStatus } from "./helpers/types";
import { getSettingsFromDifficulty } from "./helpers/helpers";

function App() {
  const [width, setWidth] = useState<number>(30);
  const [height, setHeight] = useState<number>(16);
  const [mines, setMines] = useState<number>(99);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Starting);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Difficult);

  const onChange = (e: SyntheticEvent) => {
    const settings = getSettingsFromDifficulty(parseInt((e.target as HTMLInputElement).value) as Difficulty)
    setWidth(settings.width);
    setHeight(settings.height);
    setMines(settings.mines);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Game width={width} height={height} mines={mines} setStatus={(status) => setGameStatus(status)} status={gameStatus}/>
        {gameStatus === GameStatus.Lost && "lmao you lost"}
        {gameStatus === GameStatus.Won && "yay you won"}
        <div onChange={(e) => {onChange(e)}}>
          <div>
            <label>Easy</label>
          <input type="radio" value={Difficulty.Easy} name="difficulty"/>
          </div>
          <div>
            <label>Medium</label>
          <input type="radio" value={Difficulty.Medium} name="difficulty"/>
          </div>
          <div>
            <label>Difficult</label>
          <input type="radio" value={Difficulty.Difficult} name="difficulty" defaultChecked/>
          </div>
          {/* <div>
            Width: <input value={width} onChange={(e) => {setWidth(parseInt(e.target.value))}}/>
          </div>
          <div>
            Height: <input value={height} onChange={(e) => setHeight(parseInt(e.target.value))}/>
          </div>
          <div>
            Mines: <input value={mines} onChange={(e) => setWidth(parseInt(e.target.value))}/>
          </div> */}
        </div>
      </header>
    </div>
  );
}

export default App;
