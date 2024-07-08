import { Cell } from './Cell';

export class Board {
    private readonly board: Cell[][];
    private readonly handleCellClick: (row: number, col: number) => void;
    private readonly handleCellRightClick: (row: number, col: number) => void;
    constructor(size: number, mineCount: number, handleCellClick: (row: number, col: number) => void, handleCellRightClick: (row: number, col: number) => void) {
        this.handleCellClick = handleCellClick;
        this.handleCellRightClick = handleCellRightClick;

        this.board = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ({ mine: false, flagged: false, revealed: false, adjacentMines: 0 }))
        );

        this.setMines(size, mineCount);

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                this.board[row][col].adjacentMines = this.countAdjacentMines(row, col);
            }
        }
    }

    private countAdjacentMines(row: number, col: number) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        return directions.filter(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            return this.board[r] && this.board[r][c] && this.board[r][c].mine;
        }).length;
    }

    private setMines(size: number, mineCount: number) {
        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            if (!this.board[row][col].mine) {
                this.board[row][col].mine = true;
                minesPlaced++;
            }
        }
    }

    public renderBoard(gameContainer: HTMLDivElement) {
        gameContainer.innerHTML = '';
        gameContainer.style.gridTemplateColumns = `repeat(${this.board.length}, 30px)`;

        this.board.forEach((row, r) => {
            row.forEach((_, c) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.classList.add(`cellRender-${r * this.board.length + c}`);
                cellDiv.dataset.row = r.toString();
                cellDiv.dataset.col = c.toString();

                cellDiv.addEventListener('click', () => this.handleCellClick(r, c));
                cellDiv.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellRightClick(r, c);
                });

                gameContainer.appendChild(cellDiv);
            });
        });
    }

    public renderCell(row: number, col: number) : void {
        const cell = this.getCell(row, col);
        const cellDiv = document.querySelector(`.cellRender-${row * this.board.length + col}`) as HTMLDivElement;
        if (cell.revealed) {
            cellDiv.classList.add('opened');
            if (cell.mine) {
                cellDiv.classList.add('mine');
                cellDiv.innerText = '💣';
            } else {
                if (cell.adjacentMines > 0) {
                    cellDiv.innerText = cell.adjacentMines.toString();
                    cellDiv.classList.add(`color-${cell.adjacentMines}`);
                }
            }
        } else {
            cellDiv.classList.remove('opened', 'mine', 'flagged', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8');
            cellDiv.innerText = '';
            if (cell.flagged) {
                cellDiv.classList.add('flagged');
                cellDiv.innerText = '🚩';
            }
        }
    }

    public getCell(row: number, col: number): Cell {
        return this.board[row][col];
    }

    public revealEmptyCells(row: number, col: number) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        this.renderCell(row, col);

        const stack = [[row, col]];
        while (stack.length > 0) {
            const [r, c] = stack.pop()!;
            for (const [dr, dc] of directions) {
                const nr = r + dr, nc = c + dc;
                if (this.board[nr] && this.board[nc] && !this.board[nr][nc].revealed && !this.board[nr][nc].flagged) {
                    this.board[nr][nc].revealed = true;
                    this.renderCell(nr, nc);

                    if (this.board[nr][nc].adjacentMines === 0) {
                        stack.push([nr, nc]);
                    }
                }
            }
        }
    }

    public revealAllMines() {
        this.board.flat().forEach((cell, idx) => {
            if (cell.mine) {
                cell.revealed = true;
                const row = Math.floor(idx / this.board.length);
                const col = idx % this.board.length;
                this.renderCell(row, col);
            }
        });
    }

    public getUnrevealedCells(): Cell[] {
        return this.board.flat().filter(cell => !cell.revealed);
    }

    public getMineCount(): number {
        return this.board.flat().filter(cell => cell.mine).length;
    }
}
