"use client";

import { useEffect, useState } from "react";
import z from "zod";

import { authClient } from "@/lib/auth/auth-client";
import type { FormElement } from "../types";

const userSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    email: z.string(),
});

type User = z.infer<typeof userSchema>;

type Props = {
    elements: FormElement[];
};

const FormBuilder = ({
    elements,
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
            {elements.map((element) => {
                switch (element.type) {
                    case "input":
                        if (user) {
                            return <InputElement key={element.id} element={element} user={user} />
                        } else {
                            return null;
                        }
                    case "label":
                        return <LabelElement key={element.id} element={element} />
                    default:
                        return null;
                }
            })}
        </div>
    );
};

const LabelElement = ({
    element,
}: {
    element: FormElement;
}) => {
    if (element.type !== "label") return null;

    return (
        <div
            className="absolute flex"
            style={{
                ...element.rect,
                ...element.data,
            }}
        >
            {element.data.value}
        </div>
    );
};

const InputElement = ({
    element,
    user,
}: {
    element: FormElement;
    user: User;
}) => {
    if (element.type !== "input") return null;

    let value = element.data.value;

    switch (element.data.referenceValue) {
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
            className="absolute block px-2 py-1 outline-none"
            style={{
                ...element.rect,
                ...element.data,
            }}
            defaultValue={value}
            readOnly={!element.data.editable}
        />
    );
};

export default FormBuilder;