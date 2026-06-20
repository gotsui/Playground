import { z } from "zod";

import type { TaskNode } from "./types";

const dateToStringSchema = z.coerce.date().transform((date) => date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }));
const datetimeToStringSchema = z.coerce.date().transform((date) => date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));

export const statusSchema = z.enum(["新規", "進行中", "完了"]);

const baseNodeSchema = z.object({
    id: z.uuidv4(),
    name: z.string().min(1, "タスク名を入力してください"),
    status: statusSchema,
    plannedEffort: z.coerce.number("数値を入力してください").min(0, "マイナスの値は入力できません"),
    buffer: z.coerce.number("数値を入力してください").min(0, "マイナスの値は入力できません"),
    actualEffort: z.coerce.number("数値を入力してください").min(0, "マイナスの値は入力できません"),
    assignee: z.string().optional().nullable(),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    notes: z.string().optional().nullable(),
}).refine((data) => !data.startDate || !data.endDate || (data.startDate && data.endDate && data.startDate <= data.endDate), {
    message: "終了日は開始日以降の日付を入力してください",
    path: ["endDate"],
});

export const taskNodeSchema: z.ZodType<TaskNode> = z.lazy(() =>
    baseNodeSchema.and(z.object({
        children: z.array(taskNodeSchema),
    }))
);

export const idSchema = z.uuidv4().nonempty();

export const wbsSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    updatedAt: dateToStringSchema,
});

export const wbsListSchema = z.array(wbsSchema);

export const wbsTaskSchema = baseNodeSchema.and(z.object({
    parentId: z.uuidv4().nullable(),
    logicalId: z.uuidv4(),
    logicalParentId: z.uuidv4().nullable(),
}));

export const wbsTasksSchema = z.array(wbsTaskSchema);

export const wbsTaskHistorySchema = baseNodeSchema.and(z.object({
    taskId: z.uuidv4(),
    parentId: z.uuidv4().nullable(),
    logicalId: z.uuidv4(),
    logicalParentId: z.uuidv4().nullable(),
    createdAt: datetimeToStringSchema,
    createdBy: z.string(),
}));

export const wbsTaskHistoriesSchema = z.array(wbsTaskHistorySchema);

export const wbsRoleSchema = z.enum(["owner", "admin", "editor", "viewer"]);

export const wbsUserSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
});

export const wbsUsersSchema = z.array(wbsUserSchema);

export const wbsMemberSchema = z.object({
    id: z.uuidv4(),
    userId: z.uuidv4(),
    userName: z.string(),
    role: wbsRoleSchema,
});

export const wbsMembersSchema = z.array(wbsMemberSchema);
