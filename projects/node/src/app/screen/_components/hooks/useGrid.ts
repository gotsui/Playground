"use client";

import { useCallback } from "react";

import useDOMSize from "./useDOMSize";

export type XYPosition = {
    x: number;
    y: number;
};

export type CellAddress = {
    row: number;
    column: number;
};

export type CellSize = {
    width: number;
    height: number;
};

type UseGridProps = {
    row: number;
    column: number;
};

const useGrid = ({
    row,
    column,
}: UseGridProps) => {
    const PLACE = 100;

    const { ref: gridRef, rect } = useDOMSize();

    const cellSize: CellSize = {
        width: Math.floor(rect.width / column * PLACE) / PLACE,
        height: Math.floor(rect.height/ row * PLACE) / PLACE,
    };

    const screenToCellAddress = useCallback((clientPosition: XYPosition): CellAddress => {
        const gridPosition = {
            x: clientPosition.x - rect.left,
            y: clientPosition.y - rect. top,
        };

        return {
            row: Math.floor(gridPosition.y / cellSize.height),
            column: Math.floor(gridPosition.x / cellSize.width),
        };
    }, [rect, cellSize]);

    const addressToPosition = useCallback((address: CellAddress): XYPosition => {
        return {
            x: address.column * cellSize.width + rect.left,
            y: address.row * cellSize.height + rect.top,
        };
    }, [rect, cellSize]);

    const getRow = () => {
        return row;
    };

    const getColumn = () => {
        return column;
    };

    return {
        gridRef,
        rect,
        cellSize,
        screenToCellAddress,
        addressToPosition,
        getRow,
        getColumn,
    };
};

export default useGrid;