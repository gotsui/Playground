"use client";

import { calcRelativePosition } from "../lib/position";
import { Handle, resizeRect } from "../lib/resize";
import usePointerPosition from "../lib/usePointerPosition";
import { Field } from "../types";

type Props = {
    grid: HTMLElement;
    field: Field;
    handle: Handle;
};

const ResizeGhost = ({
    grid,
    field,
    handle,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return null;

    const rect = resizeRect(
        field.rect,
        handle,
        calcRelativePosition(pointerPosition, grid),
    );

    return (
        <div
            className="absolute flex pointer-events-none opacity-50 z-100"
            style={{
                ...field.data,
                ...rect,
            }}
        >
            {field.data.value}
        </div>
    );
};

export default ResizeGhost;