import z from "zod";

export const idSchema = z.uuidv4();

export const nameSchema = z.string()
    .nonempty("nameは必須です")
    .regex(/^[0-9a-zA-Z]*$/, "半角英数字で入力してください");

export const formSchema = z.object({
    id: idSchema,
    name: nameSchema,
    createdAt: z.coerce.date().transform((date) => date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })),
    updatedAt: z.coerce.date().transform((date) => date.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })),
});

export const formsSchema = z.array(formSchema);
