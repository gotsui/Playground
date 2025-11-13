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
    const value = useGrid({ row: 12, column: 12 });

    return (
        <GridContext value={value}>
            {children}
        </GridContext>
    );
};

export default GridProvider;