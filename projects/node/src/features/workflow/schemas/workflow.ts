import z from "zod";

const dateSchema = z.coerce.date().transform((date) => date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }));

export const idSchema = z.uuidv4();

export const nameSchema = z.string()
    .nonempty("nameは必須です")
    .regex(/^[0-9a-zA-Z]*$/, "半角英数字で入力してください");

export const flowSchema = z.object({
    id: idSchema,
    name: nameSchema,
    createdAt: dateSchema,
    updatedAt: dateSchema,
});

export const flowsSchema = z.array(flowSchema);
