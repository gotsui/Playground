"use client";

import React from "react";
import { DnDContext } from "./DnDContext";
import useDnD from "./hooks/useDnD";

type DnDProviderProps = {
    children: React.ReactNode;
};

const DnDProvider = ({
    children,
}: DnDProviderProps) => {
    const { isDragging, handlePointerDown } = useDnD();

    return (
        <DnDContext value={{ isDragging, handlePointerDown }}>
            {children}
        </DnDContext>
    )
};

export default DnDProvider;