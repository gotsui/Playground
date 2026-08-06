"use client";

import { calcRelativePosition } from "../lib/position";
import { Handle, resizeRect } from "../lib/resize";
import usePointerPosition from "../lib/usePointerPosition";
import { FormElement } from "../types";

type Props = {
    grid: HTMLElement;
    element: FormElement;
    handle: Handle;
};

const ResizeGhost = ({
    grid,
    element,
    handle,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return null;

    const rect = resizeRect(
        element.rect,
        handle,
        calcRelativePosition(pointerPosition, grid),
    );

    return (
        <div
            className="absolute flex pointer-events-none opacity-50 z-100"
            style={{
                ...element.data,
                ...rect,
            }}
        >
            {element.data.value}
        </div>
    );
};

export default ResizeGhost;