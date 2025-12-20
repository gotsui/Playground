import z from "zod";

export const idSchema = z.uuidv4();

export const nameSchema = z.string()
    .nonempty("nameは必須です")
    .regex(/^[0-9a-zA-Z]*$/, "半角英数字で入力してください");