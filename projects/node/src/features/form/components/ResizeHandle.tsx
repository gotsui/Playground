"use client";

import { PointerEvent } from "react";

import { Handle } from "../lib/resize";
import { FormElement } from "../types";

type Props = {
    element: FormElement;
    onPointerDown: (
        e: PointerEvent<HTMLDivElement>,
        element: FormElement,
        handle: Handle,
    ) => void;
};

const ResizeHandle = ({
    element,
    onPointerDown,
}: Props) => {
    return (
        <div
            className={[
                "absolute",
                "border border-black",
                "pointer-events-none",
            ].join(" ")}
            style={{
                ...element.rect,
            }}
        >
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-0 translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-nw-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "topLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-[50%] translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-n-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "topCenter")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-full translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-ne-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "topRight")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-0 translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-w-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "middleLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-full translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-e-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "middleRight")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-full left-0 translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-sw-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "bottomLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-full left-[50%] translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-s-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "bottomCenter")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-full left-full translate-[-50%]",
                    "bg-white border rounded-full",
                    "cursor-se-resize",
                    "pointer-events-auto",
                ].join(" ")}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => onPointerDown(e, element, "bottomRight")}
            />
        </div>
    );
};

export default ResizeHandle;