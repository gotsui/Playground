import z from "zod";

export const rectSchema = z.object({
    top: z.number().nonnegative(),
    left: z.number().nonnegative(),
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
});

export const writingModeSchema = z.enum([
    "horizontal-tb",
    "vertical-lr",
    "vertical-rl",
    "sideways-rl",
    "sideways-lr",
]);

export const borderStyleSchema = z.enum([
    "solid",
    "none",
]);

export const justifyContentSchema = z.enum([
    "start",
    "center",
    "end",
    "space-between",
    "stretch",
]);

export const alignItemsSchema = z.enum([
    "start",
    "center",
    "end",
    "space-between",
    "stretch",
]);

export const referenceValueSchema = z.enum([
    "none",
    "user-name",
    "user-email",
    "system-date",
    "system-datetime",
]);

const baseFormElementSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    rect: rectSchema,
});

const baseDataSchema = z.object({
    color: z.string(),
    value: z.string(),
    writingMode: writingModeSchema,
    fontSize: z.number(),
    disabled: z.boolean(),
    hidden: z.boolean(),
    backgroundColor: z.string(),
    borderStyle: borderStyleSchema,
    borderWidth: z.number(),
    borderColor: z.string(),
    justifyContent: justifyContentSchema,
    alignItems: alignItemsSchema,
});

const elementDataSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("label"),
        data: baseDataSchema,
    }),
    z.object({
        type: z.literal("input"),
        data: baseDataSchema.and(z.object({
            editable: z.boolean(),
            referenceValue: referenceValueSchema,
        }))
    })
]);

export const formElementSchema = baseFormElementSchema.and(elementDataSchema);
export const formElementsSchema = z.array(formElementSchema);
