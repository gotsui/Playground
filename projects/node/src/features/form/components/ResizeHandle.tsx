"use client";

import { PointerEvent } from "react";

import { Handle } from "../lib/resize";
import { Field } from "../types";

type Props = {
    field: Field;
    onPointerDown: (
        e: PointerEvent<HTMLDivElement>,
        field: Field,
        handle: Handle,
    ) => void;
};

const ResizeHandle = ({
    field,
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
                ...field.rect,
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
                onPointerDown={(e) => onPointerDown(e, field, "topLeft")}
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
                onPointerDown={(e) => onPointerDown(e, field, "topCenter")}
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
                onPointerDown={(e) => onPointerDown(e, field, "topRight")}
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
                onPointerDown={(e) => onPointerDown(e, field, "middleLeft")}
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
                onPointerDown={(e) => onPointerDown(e, field, "middleRight")}
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
                onPointerDown={(e) => onPointerDown(e, field, "bottomLeft")}
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
                onPointerDown={(e) => onPointerDown(e, field, "bottomCenter")}
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
                onPointerDown={(e) => onPointerDown(e, field, "bottomRight")}
            />
        </div>
    );
};

export default ResizeHandle;