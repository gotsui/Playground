import z from "zod";
import { fieldSchema, rectSchema } from "./schemas/field";

export type Rect = z.infer<typeof rectSchema>;

export type Field = z.infer<typeof fieldSchema>;
