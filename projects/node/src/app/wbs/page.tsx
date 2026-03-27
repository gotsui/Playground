"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";

import { wbsListSchema } from "./_lib/schema";
import type { Wbs } from "./_lib/types";

const WbsHomePage = () => {
    const [wbsList, setWbsList] = useState<Wbs[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const res = await fetch("/api/wbs");

            if (!res.ok) {
                console.error(await res.json());
                setIsLoading(false);
                return;
            }

            const { wbs } = await res.json();
            const parsedWbs = wbsListSchema.safeParse(wbs);

            if (parsedWbs.success) {
                setWbsList(parsedWbs.data);
            } else {
                console.error(parsedWbs.error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleClickDelete = async (id: string) => {
        const targetWbs = wbsList.find((wbs) => wbs.id === id);

        if (!targetWbs) {
            alert("削除に失敗しました");
            return;
        }

        if (!confirm(`${targetWbs.name} を削除します`)) {
            return;
        }

        const res = await fetch(`/api/wbs/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.error(await res.json());
            alert("削除に失敗しました");
            return;
        }

        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex items-center gap-8 p-4">
                <Link href={"/"}>
                    <ArrowLeft />
                </Link>
                <div className="text-2xl">WBS</div>
                <Link
                    href="/wbs/new"
                    className={[
                        "block size-10 p-2",
                        "bg-indigo-100 rounded-lg border-2 border-indigo-300",
                        "hover:border-indigo-400",
                    ].join(" ")}
                >
                    <Plus className="size-full" />
                </Link>
            </div>
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
            ) : (
                <ul className="m-4">
                    {wbsList.map((wbs) => (
                        <li
                            key={wbs.id}
                            className={[
                                "grid grid-cols-12 items-center",
                            ].join(" ")}
                        >
                            <div className="col-span-6">
                                {wbs.name}
                            </div>
                            <div className="col-span-3">
                                <Link
                                    href={`/wbs/${wbs.id}`}
                                    className={[
                                        "inline-block rounded-full p-1",
                                        "hover:bg-indigo-200",
                                    ].join(" ")}
                                >
                                    <Edit2 />
                                </Link>
                            </div>
                            <div className="col-span-3">
                                <button
                                    type="button"
                                    className={[
                                        "rounded-full p-1 cursor-pointer",
                                        "hover:bg-red-200",
                                    ].join(" ")}
                                    onClick={() => handleClickDelete(wbs.id)}
                                >
                                    <Trash2 className="hover:underline" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WbsHomePage;