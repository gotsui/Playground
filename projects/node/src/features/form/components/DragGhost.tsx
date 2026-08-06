"use client";

import { calcRelativePosition } from "../lib/position";
import type { XYPosition } from "../lib/useDnD";
import usePointerPosition from "../lib/usePointerPosition";
import type { FormElement } from "../types";

type Props = {
    grid: HTMLElement;
    element: FormElement;
    offset: XYPosition;
};

const DragGhost = ({
    grid,
    element,
    offset,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return null;

    const calced = calcRelativePosition(pointerPosition, grid);

    return (
        <div
            className="absolute flex pointer-events-none opacity-50 z-100"
            style={{
                top: calced.y + offset.y,
                left: calced.x + offset.x,
                width: element.rect.width,
                height: element.rect.height,
                ...element.data,
            }}
        >
            {element.data.value}
        </div>
    );
};

export default DragGhost;