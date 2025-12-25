"use client";

import usePointerPosition from "@/hooks/usePointerPosition";
import { Size } from "../types";

type Props = {
    size: Size;
    children: React.ReactNode;
};

const Ghost = ({
    size,
    children,
}: Props) => {
    const { pointerPosition } = usePointerPosition();
    if (!pointerPosition) return null;

    return (
        <div
            className="fixed p-2"
            style={{
                top: pointerPosition.y,
                left: pointerPosition.x,
                ...size,
            }}
        >
            {children}
        </div>
    );
};

export default Ghost;