import z from "zod";
import { wbsSchema, wbsTaskSchema } from "./schema";

export type Status = "新規" | "進行中" | "完了";

export type TaskNode = {
    id: string;
    name: string;
    assignee?: string | null;
    status: Status;
    effort: number;
    buffer: number;
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
    effort: string;
    buffer: string;
    notes: string;
};

export type Wbs = z.infer<typeof wbsSchema>;

export type WbsTask = z.infer<typeof wbsTaskSchema>;
