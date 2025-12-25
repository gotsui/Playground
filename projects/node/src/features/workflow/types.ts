import z from "zod";
import { processSchema } from "./schemas/process";

export type CellAddress = {
    row: number;
    column: number;
};

export type Coordinates = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};

export type Position = {
    top: number;
    left: number;
};

export type Rect = Position & Size;

export type Process = z.infer<typeof processSchema>;