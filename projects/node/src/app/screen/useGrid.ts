"use client";

import useDOMSize from "./useDOMSize";

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
    const cellSize = {
        width: Math.floor(rect.width / column * PLACE) / PLACE,
        height: Math.floor(rect.height/ row * PLACE) / PLACE,
    };

    return { gridRef, rect, cellSize };
};

export default useGrid;