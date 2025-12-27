"use client";

import usePointerPosition from "@/hooks/usePointerPosition";
import { Position, Size } from "../types";

type Props = {
    ghostSize: Size;
    offset?: Position;
    zIndex?: number,
    children: React.ReactNode;
};

const Ghost = ({
    ghostSize,
    offset,
    zIndex = 50,
    children,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return null;

    const position = offset
        ? {
            top: pointerPosition.y + offset.top,
            left: pointerPosition.x + offset.left,
        }
        : { top: pointerPosition.y, left: pointerPosition.x };

    return (
        <div
            className="fixed p-2"
            style={{
                ...position,
                ...ghostSize,
                zIndex,
            }}
        >
            {children}
        </div>
    );
};

export default Ghost;