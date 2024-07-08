import './style.css';
import {Game} from "./Game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div id="game-dialog" class="dialog">
        <div class="dialog-content">
            <p id="dialog-message"></p>
            <button id="dialog-close">Close</button>
        </div>
    </div>
    <div class="container">
        <div class="controls">
            <select id="difficulty">
                <option value="easy">Easy (10x10, 10 mines)</option>
                <option value="medium">Medium (16x16, 40 mines)</option>
                <option value="hard">Hard (24x24, 99 mines)</option>
            </select>
            <button id="restart">Restart</button>
         </div>
        <div id="timer">Time: 0s</div>
        <div id="game"></div>
    </div>
`;

new Game();