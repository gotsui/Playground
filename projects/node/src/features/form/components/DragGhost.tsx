"use client";

import { calcRelativePosition } from "../lib/position";
import { XYPosition } from "../lib/useDnD";
import usePointerPosition from "../lib/usePointerPosition";
import { Field } from "../types";

type Props = {
    grid: HTMLElement;
    field: Field;
    offset: XYPosition;
};

const DragGhost = ({
    grid,
    field,
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
                width: field.rect.width,
                height: field.rect.height,
                ...field.data,
            }}
        >
            {field.data.value}
        </div>
    );
};

export default DragGhost;