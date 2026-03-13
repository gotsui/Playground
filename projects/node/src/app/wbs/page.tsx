"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Wbs } from "./_lib/types";
import { wbsListSchema } from "./_lib/schema";

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
            <Link href={"/wbs/new"}>
                <Plus />
            </Link>
            {isLoading ? (
                <div className="flex justify-center" aria-label="読み込み中">
                    <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
            ) : (
                <ul>
                    {wbsList.map((wbs) => (
                        <li key={wbs.id}>
                            {wbs.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WbsHomePage;