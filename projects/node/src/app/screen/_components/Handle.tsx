"use client";

import { Elm, HandleDirection } from "./types";

type HandleProps = {
    elm: Elm;
    handlePointerDown: (e: React.PointerEvent<HTMLDivElement>, elm: Elm, direction: HandleDirection) => void;
};

const Handle = ({
    elm,
    handlePointerDown,
}: HandleProps) => {
    return (
        <>
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-nw-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "nw")}
                onPointerDown={(e) => handlePointerDown(e, elm, "topLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-n-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "n")}
                onPointerDown={(e) => handlePointerDown(e, elm, "topCenter")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-ne-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "ne")}
                onPointerDown={(e) => handlePointerDown(e, elm, "topRight")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-w-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "w")}
                onPointerDown={(e) => handlePointerDown(e, elm, "middleLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-e-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "e")}
                onPointerDown={(e) => handlePointerDown(e, elm, "middleRight")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-sw-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "sw")}
                onPointerDown={(e) => handlePointerDown(e, elm, "bottomLeft")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-s-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "s")}
                onPointerDown={(e) => handlePointerDown(e, elm, "bottomCenter")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-se-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                // onPointerDown={(e) => handlePointerDown(e, elm, "se")}
                onPointerDown={(e) => handlePointerDown(e, elm, "bottomRight")}
            />
        </>
    )
};

export default Handle;