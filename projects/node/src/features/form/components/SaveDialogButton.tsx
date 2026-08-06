"use client";

import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { nameSchema } from "../schemas/form";
import type { FormElement } from "../types";

type Props = {
    caption: string;
    elements: FormElement[];
};

const SaveDialogButton = ({
    caption,
    elements,
}: Props) => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [_isPending, setIsPending] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const handleClickOpen = () => {
        if (!dialogRef.current) return;

        dialogRef.current.showModal();
    };

    const handleClickSave = async () => {
        if (!dialogRef.current) return;

        const parsedName = nameSchema.safeParse(name);

        const nextErrors: string[] = [];

        if (!parsedName.success) {
            nextErrors.push(...parsedName.error.flatten().formErrors);
        }

        if (elements.length === 0) {
            nextErrors.push("フィールドが存在しません");
        }

        setErrors(nextErrors);

        if (nextErrors.length > 0) {
            return;
        }

        setErrors([]);
        setIsPending(true);

        const res = await fetch("/api/form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: parsedName.data,
                elements,
            }),
        });

        if (!res.ok) {
            setErrors(["登録に失敗しました"]);
            setIsPending(false);
            return;
        }

        const { id } = await res.json();

        setIsPending(false);
        router.push(`/form/edit/${id}`);
        router.refresh();
        return;
    }

    const handleClickCancel = () => {
        if (!dialogRef.current) return;

        dialogRef.current.close();
    };

    return (
        <>
            <button type="button" className="size-full" onClick={handleClickOpen}>
                <Save className="size-full" />
            </button>
            <dialog
                ref={dialogRef}
                className={[
                    "absolute top-[50%] left-[50%] min-w-80 p-6",
                    "border border-slate-500 rounded-md",
                    "translate-[-50%]",
                ].join(" ")}
            >
                <div className="min-h-12 mb-2">
                    <p>{caption}</p>
                    {errors.map((error) => (
                        <p key={error} className="text-red-500">{error}</p>
                    ))}
                </div>
                <label className="block">
                    <span>名前</span>
                    <input
                        className="block w-full border px-2 py-1 rounded-md shadow"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleClickSave}
                    >
                        保存
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={handleClickCancel}
                    >
                        キャンセル
                    </button>
                </div>
            </dialog>
        </>
    );
};

export default SaveDialogButton;