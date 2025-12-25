import z from "zod";
import { fieldSchema, rectSchema } from "./schemas/field";
import { formSchema } from "./schemas/form";

export type Rect = z.infer<typeof rectSchema>;

export type Field = z.infer<typeof fieldSchema>;

export type Form = z.infer<typeof formSchema>;
