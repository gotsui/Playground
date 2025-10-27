"use client";

import { useContext } from "react";

import { DnDContext } from "./DnDContext";
import { GridContext } from "./GridContext";

export const useDnDContext = () => {
    const context = useContext(DnDContext);
 
    if (!context) {
        throw new Error('useDnD must be used within a DnDProvider');
    }

    return context;
};

export const useGridContext = () => {
    const context = useContext(GridContext);

    if (!context) {
        throw new Error('useGrid must be used within a GridProvider');
    }

    return context;
};