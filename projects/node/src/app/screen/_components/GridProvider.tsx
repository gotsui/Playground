"use client";

import React from "react";
import useGrid from "./hooks/useGrid";
import { GridContext } from "./GridContext";

type GridProviderProps = {
    children: React.ReactNode;
};

const GridProvider = ({
    children,
}: GridProviderProps) => {
    const value = useGrid({ row: 9, column: 16 });

    return (
        <GridContext value={value}>
            {children}
        </GridContext>
    );
};

export default GridProvider;