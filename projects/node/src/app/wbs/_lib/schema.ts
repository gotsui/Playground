import { z } from "zod";

import { TaskNode } from "./types";

const StatusSchema = z.enum(["新規", "進行中", "完了"]);

export const TaskNodeSchema: z.ZodType<TaskNode> = z.lazy(() =>
    z.object({
        id: z.uuidv4(),
        name: z.string().min(1, "タスク名を入力してください"),
        assignee: z.string().optional(),
        status: StatusSchema,
        effort: z.coerce.number().min(0),
        buffer: z.coerce.number().min(0),
        notes: z.string().optional(),
        children: z.array(TaskNodeSchema),
    })
);