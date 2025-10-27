"use client";

import { createContext, PointerEvent } from "react";
import { OnPointerUpAction } from "./hooks/useDnD";

type DnDContextProps = {
    isDragging: boolean;
    handlePointerDown: (event: PointerEvent<Element>, onPointerUp: OnPointerUpAction) => void;
};

export const DnDContext = createContext<DnDContextProps | undefined>(undefined);