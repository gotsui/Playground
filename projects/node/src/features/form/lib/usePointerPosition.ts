"use client";

import { useCallback, useEffect, useState } from "react";

export type XYPosition = {
    x: number;
    y: number;
};

const usePointerPosition = () => {
    const [pointerPosition, setPointerPosition] = useState<XYPosition | null>(null);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        event.preventDefault();
        setPointerPosition({ x: event.clientX, y: event.clientY });
    }, [setPointerPosition]);

    useEffect(() => {
        document.addEventListener("pointermove", handlePointerMove);

        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handlePointerMove]);

    return { pointerPosition };
};

export default usePointerPosition;