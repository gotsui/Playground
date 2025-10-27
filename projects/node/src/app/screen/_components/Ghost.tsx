"use client";

import { XYPosition } from "./hooks/usePointerPosition";

type GhostProps = {
    pointerPosition: XYPosition;
    cellSize: { width: number; height: number };
    draggedElmSize: { width: number; height: number };
};

const Ghost = ({
    pointerPosition,
    cellSize,
    draggedElmSize,
}: GhostProps) => {
    return (
        <div
            className="fixed pointer-events-none bg-yellow-100 opacity-50 z-100"
            style={{
                width: cellSize.width * draggedElmSize.width,
                height: cellSize.height * draggedElmSize.height,
                transform: `translate(${pointerPosition.x}px, ${pointerPosition.y}px) translate(-50%, -50%)`,
            }}
        />
    );
};

export default Ghost;