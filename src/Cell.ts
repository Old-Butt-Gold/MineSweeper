export interface Cell {
    mine: boolean;
    flagged: boolean;
    revealed: boolean;
    adjacentMines: number;
}