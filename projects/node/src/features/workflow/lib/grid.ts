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

export const calcCellOffset = (
    position: Position,
    address: CellAddress,
    gridRect: Rect,
    cellSize: Size,
): Position => {
    const cellPosition = addressToPosition(address, cellSize);

    return {
        top: gridRect.top + cellPosition.top - position.top,
        left: gridRect.left + cellPosition.left - position.left,
    };
};

export const calcElementOffset = (
    e: React.PointerEvent<HTMLElement>
): Position => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
        top: rect.top - e.clientY,
        left: rect.left - e.clientX,
    };
};

export const calcCellRelativePosition = (
    position: Position,
    address: CellAddress,
    cellSize: Size,
): Position => {
    const cellPosition = addressToPosition(address, cellSize);

    return {
        top: position.top - cellPosition.top,
        left: position.left - cellPosition.left,
    };
};
