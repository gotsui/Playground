import Link from "next/link";
import { ArrowLeft, Download, Save } from "lucide-react";

type Props = {
    name: string;
    ccpmMode: boolean;
    onToggleCcpm: (enabled: boolean) => void;
    totalHours: number;
    projectBuffer?: number;
    onClickSave: () => void;
    onClickDownload: () => void;
};

const WbsHeader = ({
    name,
    ccpmMode,
    onToggleCcpm,
    totalHours,
    projectBuffer,
    onClickSave,
    onClickDownload,
}: Props) => {
    return (
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={"/wbs"}>
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">WBS - {name}</h1>
                </div>
                <div className="flex items-center gap-10">
                    {/* <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={ccpmMode}
                            onChange={(e) => onToggleCcpm(e.target.checked)}
                            className="w-6 h-6 text-purple-600"
                        />
                        <span className={`text-lg font-bold ${ccpmMode ? "text-purple-600" : "text-gray-500"}`}>
                            {ccpmMode ? "CCPMモード ON" : "従来モード"}
                        </span>
                    </label> */}
                    <div className="text-xl font-bold text-blue-600">
                        総予定工数（バッファ込み）：{totalHours}h
                        {ccpmMode && projectBuffer !== undefined && (
                            <span className="ml-4 text-purple-600">
                                プロジェクトバッファ：{projectBuffer}h
                            </span>
                        )}
                    </div>
                    <button className="cursor-pointer" onClick={onClickSave}>
                        <Save />
                    </button>
                    <button className="cursor-pointer" onClick={onClickDownload}>
                        <Download />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WbsHeader;