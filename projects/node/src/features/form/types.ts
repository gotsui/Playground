import type z from "zod";
import type { formElementSchema, rectSchema } from "./schemas/formElement";
import type { formSchema } from "./schemas/form";

export type Rect = z.infer<typeof rectSchema>;

export type FormElement = z.infer<typeof formElementSchema>;

export type Form = z.infer<typeof formSchema>;
