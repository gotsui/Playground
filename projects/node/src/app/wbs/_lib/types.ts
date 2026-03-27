import type z from "zod";

import type { wbsSchema, wbsTaskSchema } from "./schema";

export type Status = "新規" | "進行中" | "完了";

export type TaskNode = {
    id: string;
    name: string;
    assignee?: string | null;
    status: Status;
    plannedEffort: number;
    buffer: number;
    actualEffort: number;
    notes?: string | null;
    children: TaskNode[];
};

export type TaskWithCalc = TaskNode & {
    totalEffort: number;
    totalWithBuffer: number;
};

export type EditingRow = {
    id: string;
    name: string;
    assignee: string;
    status: string;
    plannedEffort: string;
    buffer: string;
    actualEffort: string;
    notes: string;
};

export type Wbs = z.infer<typeof wbsSchema>;

export type WbsTask = z.infer<typeof wbsTaskSchema>;

export type WbsFilterKey = Exclude<keyof TaskNode, "children">;
export type WbsFilterMap = Map<WbsFilterKey, Set<string>>;
export type ColumnFilterKey = Exclude<keyof TaskNode, "id" | "name" | "children">
    | "withBuffer"
    | "totalWithBuffer"
;
