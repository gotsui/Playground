"use client";

import { useCallback, useEffect, useState } from "react";

export type XYPosition = {
    x: number;
    y: number;
};

export type OnPointerUpAction = ({ position }: { position: XYPosition }) => void;

const useDnD = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [pointerUpAction, setPointerUpAction] = useState<OnPointerUpAction | null>(null);

    const handlePointerDown = useCallback((event: React.PointerEvent, onPointerUp: OnPointerUpAction) => {
        event.preventDefault();
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        setIsDragging(true);
        setPointerUpAction(() => onPointerUp);
    }, [setIsDragging, setPointerUpAction]);

    const handlePointerUp = (event: PointerEvent) => {
        if (!isDragging) return;

        event.preventDefault();
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);

        const position = { x: event.clientX, y: event.clientY };
        pointerUpAction?.({ position });

        setIsDragging(false);
    };

    useEffect(() => {
        if (!isDragging) return;

        document.addEventListener("pointerup", handlePointerUp);

        return () => {
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isDragging, handlePointerUp]);

    return {
        isDragging,
        handlePointerDown,
    };
};

export default useDnD;