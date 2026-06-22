import Link from "next/link";
import { ArrowLeft, Download, Save } from "lucide-react";

import type { WbsRole } from "../_lib/types";
import { useState } from "react";

type Props = {
    name: string;
    ccpmMode: boolean;
    onToggleCcpm: (enabled: boolean) => void;
    totalHours: number;
    projectBuffer?: number;
    onClickSave: () => void;
    onClickDownload: () => void;
    wbsRole: WbsRole;
};

const WbsHeader = ({
    name,
    ccpmMode,
    totalHours,
    projectBuffer,
    onClickSave,
    onClickDownload,
    wbsRole,
}: Props) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleClickSave = () => {
        setIsSaving(true);
        onClickSave();
        setIsSaving(false);
    };

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={"/wbs"}>
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">WBS - {name}</h1>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-xl font-bold text-blue-600">
                        総予定工数（バッファ込み）：{totalHours}h
                        {ccpmMode && projectBuffer !== undefined && (
                            <span className="ml-4 text-purple-600">
                                プロジェクトバッファ：{projectBuffer}h
                            </span>
                        )}
                    </div>
                    {wbsRole !== "viewer" && (
                        <button
                            type="button"
                            className="cursor-pointer anchor-scope group"
                            onClick={handleClickSave}
                            disabled={isSaving}
                        >
                            <Save className="relative anchor" />
                            <span
                                className={[
                                    "hidden p-1 z-100",
                                    "bg-gray-500 text-white text-nowrap rounded-md",
                                    "group-hover:block after:",
                                    "popover",
                                ].join(" ")}
                            >
                                保存
                            </span>
                        </button>
                    )}
                    <button type="button" className="cursor-pointer anchor-scope group" onClick={onClickDownload}>
                        <Download className="relative anchor" />
                        <span
                            className={[
                                "hidden p-1 z-100",
                                "bg-gray-500 text-white text-nowrap rounded-md",
                                "group-hover:block after:",
                                "popover",
                            ].join(" ")}
                        >
                            ダウンロード
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WbsHeader;