"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Field } from "../types";
import { useEffect, useState } from "react";
import z, { email } from "zod";

const userSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    email: z.string(),
});

type User = z.infer<typeof userSchema>;

type Props = {
    fields: Field[];
};

const FormBuilder = ({
    fields,
}: Props) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const session = await authClient.getSession();
            const parsed = userSchema.safeParse(session.data?.user);

            if (parsed.success) {
                setUser(parsed.data);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="relative size-full">
            {fields.map((field) => {
                switch (field.type) {
                    case "input":
                        if (user) {
                            return <InputField key={field.id} field={field} user={user} />
                        }
                    case "label":
                        return <LabelField key={field.id} field={field} />
                    default:
                        return null;
                }
            })}
        </div>
    );
};

const LabelField = ({
    field,
}: {
    field: Field;
}) => {
    if (field.type !== "label") return null;

    return (
        <div
            className="absolute flex"
            style={{
                ...field.rect,
                ...field.data,
            }}
        >
            {field.data.value}
        </div>
    );
};

const InputField = ({
    field,
    user,
}: {
    field: Field;
    user: User;
}) => {
    if (field.type !== "input") return null;

    let value = field.data.value;

    switch (field.data.referenceValue) {
        case "none":
            break;
        case "user-name":
            value = user.name;
            break;
        case "user-email":
            value = user.email;
            break;
        case "system-date":
            value = new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
            break;
        case "system-datetime":
            value = new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
            break;
        default:
            break;
    };

    return (
        <input
            className="absolute block px-2 py-1"
            style={{
                ...field.rect,
                ...field.data,
            }}
            defaultValue={value}
            readOnly={!field.data.editable}
        />
    );
};

export default FormBuilder;