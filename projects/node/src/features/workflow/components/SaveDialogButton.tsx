"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { Process } from "../types";
import { nameSchema } from "../schemas/workflow";

type Props = {
    caption: string;
    processes: Process[];
    formId: string;
};

const SaveDialogButton = ({
    caption,
    processes,
    formId,
}: Props) => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [isPending, setIsPending] = useState(false);
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

        if (processes.length === 0) {
            nextErrors.push("プロセスが存在しません");
        }

        setErrors(nextErrors);

        if (nextErrors.length > 0) {
            return;
        }

        setErrors([]);
        setIsPending(true);

        const res = await fetch("/api/workflow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: parsedName.data,
                processes,
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
            <button className="size-full" onClick={handleClickOpen}>
                <Save />
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
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-500">{error}</p>
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleClickSave}
                    >
                        保存
                    </button>
                    <button
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