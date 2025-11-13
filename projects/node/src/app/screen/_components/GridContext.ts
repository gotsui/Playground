"use client";

import { createContext } from "react";

import { CellAddress, CellSize, XYPosition } from "./hooks/useGrid";
import { Rect } from "./hooks/useDOMSize";

type GridContextProps = {
    gridRef: (element: HTMLElement | null) => (() => void) | undefined;
    rect: Rect;
    cellSize: CellSize;
    screenToCellAddress: (clientPosition: XYPosition) => CellAddress;
    addressToPosition: (address: CellAddress) => XYPosition;
    getRow: () => number;
    getColumn: () => number;
};

export const GridContext = createContext<GridContextProps | undefined>(undefined);