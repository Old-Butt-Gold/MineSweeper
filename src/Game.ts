import { Board } from './Board';
import { Timer } from './Timer';
import {Difficulty} from "./Difficulty.ts";

export class Game {
    private board!: Board;
    private timer: Timer;
    private difficultySelect: HTMLSelectElement;
    private restartButton: HTMLButtonElement;
    private readonly gameContainer: HTMLDivElement;
    private isFirstClick = true;

    private stateEndOfGame : string | null = null;

    private readonly difficulties: Record<string, Difficulty> = {
        easy: { size: 10, mines: 10 },
        medium: { size: 16, mines: 40 },
        hard: { size: 24, mines: 99 }
    };

    public constructor() {
        this.difficultySelect = document.querySelector<HTMLSelectElement>('#difficulty')!;
        this.restartButton = document.querySelector<HTMLButtonElement>('#restart')!;
        this.gameContainer = document.querySelector<HTMLDivElement>('#game')!;
        this.timer = new Timer(document.querySelector<HTMLDivElement>('#timer')!);

        this.difficultySelect.addEventListener('change', () => this.init());
        this.restartButton.addEventListener('click', () => this.init());
    }

    public init() {
        this.stateEndOfGame = null;
        this.isFirstClick = true;
        const { size, mines } = this.difficulties[this.difficultySelect.value];
        this.board = new Board(size, mines, this.handleCellClick.bind(this), this.handleCellRightClick.bind(this));
        this.board.renderBoard(this.gameContainer);
        this.timer.start();
    }

    private handleCellClick(row: number, col: number) {
        if (this.stateEndOfGame !== null) {
            return;
        }

        if (this.isFirstClick) {
            while (this.board.getCell(row, col).mine) {
                const { size, mines } = this.difficulties[this.difficultySelect.value];
                this.board = new Board(size, mines, this.handleCellClick.bind(this), this.handleCellRightClick.bind(this));
            }
            this.isFirstClick = false;
        }

        const cell = this.board.getCell(row, col);
        if (cell.revealed || cell.flagged) return;

        cell.revealed = true;

        if (cell.mine) {
            this.gameOver();
        } else {
            if (cell.adjacentMines === 0) {
                this.board.revealEmptyCells(row, col);
            } else {
                this.board.renderCell(row, col);
            }
            this.checkWin();
        }
    }

    private handleCellRightClick(row: number, col: number) {
        if (this.stateEndOfGame !== null) {
            return;
        }

        const cell = this.board.getCell(row, col);
        if (cell.revealed) return;

        cell.flagged = !cell.flagged;
        this.board.renderCell(row, col);
    }

    private gameOver() {
        this.timer.stop();
        console.log(1);
        this.stateEndOfGame = 'lost';
        this.board.revealAllMines();
        setTimeout(() => {
            alert('Game Over!');
        }, 1);
    }

    private checkWin() {
        const unrevealedCells = this.board.getUnrevealedCells().length;
        const mineCount = this.board.getMineCount();
        if (unrevealedCells === mineCount) {
            this.timer.stop();
            this.stateEndOfGame = 'won';
            setTimeout(() => {
                alert('You Win!');
            }, 1);
        }
    }
}
