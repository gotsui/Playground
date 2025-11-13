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
                onPointerDown={(e) => handlePointerDown(e, elm, "nw")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-n-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "n")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-0 left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-ne-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "ne")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-w-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "w")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[50%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-e-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "e")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-sw-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "sw")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-s-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "s")}
            />
            <div
                className={[
                    "absolute z-50 w-2 h-2",
                    "top-[100%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-se-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
                onPointerDown={(e) => handlePointerDown(e, elm, "se")}
            />
        </>
    )
};

export default Handle;