"use client";

import { calcRelativePosition } from "../lib/position";
import type { XYPosition } from "../lib/useDnD";
import usePointerPosition from "../lib/usePointerPosition";
import type { Rect } from "../types";

type Props = {
    grid: HTMLElement;
    startPosition: XYPosition;
};

const DragRect = ({
    grid,
    startPosition,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return;

    const { x: startX, y: startY } = startPosition;
    const { x: endX, y: endY } = calcRelativePosition(pointerPosition, grid);

    const rect: Rect = {
        top: startY < endY ? startY : endY,
        left: startX < endX ? startX : endX,
        width: Math.abs(startX - endX),
        height: Math.abs(startY - endY),
    };

    return (
        <div className="absolute border border-dashed" style={rect} />
    )
};

export default DragRect;