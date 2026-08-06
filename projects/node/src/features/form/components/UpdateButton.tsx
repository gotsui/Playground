"use client";

import { Save } from "lucide-react";

import { FormElement } from "../types";

type Props = {
    id: string;
    elements: FormElement[];
};

const UpdateButton = ({
    id,
    elements,
}: Props) => {
    const handleClick = async () => {
        const res = await fetch(`/api/form/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                elements,
            }),
        });

        if (!res.ok) {
            console.error(await res.json());
            return;
        }
    };

    return (
        <button className="size-full" onClick={handleClick}>
            <Save className="size-full" />
        </button>
    );
};

export default UpdateButton;