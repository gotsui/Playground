import z from "zod";
import { formElementSchema, rectSchema } from "./schemas/formElement";
import { formSchema } from "./schemas/form";

export type Rect = z.infer<typeof rectSchema>;

export type FormElement = z.infer<typeof formElementSchema>;

export type Form = z.infer<typeof formSchema>;
