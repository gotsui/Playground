import z from "zod";

const baseProcessSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    step: z.number().positive(),
    priority: z.number().positive(),
});

const baseProcessDataSchema = z.object({

});

const processDataSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("start"),
        data: baseProcessDataSchema,
    }),
    z.object({
        type: z.literal("end"),
        data: baseProcessDataSchema,
    }),
    z.object({
        type: z.literal("create"),
        data: baseProcessDataSchema,
    }),
    z.object({
        type: z.literal("request"),
        data: baseProcessDataSchema,
    }),
    z.object({
        type: z.literal("approval"),
        data: baseProcessDataSchema,
    }),
]);

export const processSchema = baseProcessSchema.and(processDataSchema);
export const processesSchema = z.array(processSchema);
