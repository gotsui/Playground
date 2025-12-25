import { CellAddress, Coordinates, Position, Rect, Size } from "../types";

export const coordinatesToAddress = (
    coordinates: Coordinates,
    gridRect: Rect,
    cellSize: Size,
): CellAddress => {
    return {
        row: Math.floor((coordinates.y - gridRect.top) / cellSize.height),
        column: Math.floor((coordinates.x - gridRect.left) / cellSize.width),
    };
};

export const addressToPosition = (
    address: CellAddress,
    cellSize: Size,
): Position => {
    return {
        top: address.row * cellSize.height,
        left: address.column * cellSize.width,
    };
};
