import { z } from "zod";

import { TaskNode } from "./types";

const statusSchema = z.enum(["新規", "進行中", "完了"]);

export const taskNodeSchema: z.ZodType<TaskNode> = z.lazy(() =>
    z.object({
        id: z.uuidv4(),
        name: z.string().trim().min(1, "タスク名を入力してください"),
        assignee: z.string().optional(),
        status: statusSchema,
        effort: z.coerce.number("数値を入力してください").min(0, "マイナスの値は入力できません"),
        buffer: z.coerce.number("数値を入力してください").min(0, "マイナスの値は入力できません"),
        notes: z.string().optional(),
        children: z.array(taskNodeSchema),
    })
);

export const idSchema = z.uuidv4().nonempty();
