import type z from "zod";

import type {
    wbsMemberSchema,
    wbsRoleSchema,
    wbsSchema,
    wbsTaskHistorySchema,
    wbsTaskSchema,
    wbsUserSchema,
} from "./schema";

export type Status = "新規" | "進行中" | "完了";

export type TaskNode = {
    id: string;
    name: string;
    status: Status;
    plannedEffort: number;
    buffer: number;
    actualEffort: number;
    assignee?: string | null;
    plannedStartDate?: Date | null;
    plannedEndDate?: Date | null;
    actualStartDate?: Date | null;
    actualEndDate?: Date | null;
    notes?: string | null;
    children: TaskNode[];
};

export type TaskWithCalc = TaskNode & {
    totalPlannedEffort: number;
    totalBuffer: number;
    totalActualEffort: number;
};

export type EditingRow = {
    id: string;
    name: string;
    status: string;
    plannedEffort: string;
    buffer: string;
    actualEffort: string;
    assignee: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string;
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

export type WbsTaskHistory = z.infer<typeof wbsTaskHistorySchema>;

export type TaskHistoryNode = TaskNode & {
    createdAt: Date;
    createdBy: string;
};

export type WbsUser = z.infer<typeof wbsUserSchema>;
export type WbsRole = z.infer<typeof wbsRoleSchema>;
export type WbsMember = z.infer<typeof wbsMemberSchema>;
