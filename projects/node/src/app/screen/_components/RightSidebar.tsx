"use client";

import { Elm } from "./types";

type RightSidebarProps = {
    elms: Elm[];
    setElms: React.Dispatch<React.SetStateAction<Elm[]>>;
    selectedElmId: string | null;
    setSelectedElmId: React.Dispatch<React.SetStateAction<string | null>>;
    deleteElm: (elmId: string) => void;
};

const RightSidebar = ({
    elms,
    setElms,
    selectedElmId,
    setSelectedElmId,
    deleteElm,
}: RightSidebarProps) => {
    return (
        <div className="flex flex-col">
            <div className="h-full w-64 space-y-2 p-2">
                <div>編集</div>
                {selectedElmId && (
                    <>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <span>ラベル</span>
                            <input
                                type="text"
                                className={[
                                    "block w-full p-2.5",
                                    "bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-300",
                                    "focus:ring-blue-500 focus:border-blue-500",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
                                    "dark:focus:ring-blue-500 dark:focus:border-blue-500",
                                ].join(" ")}
                                value={elms.find((elm) => elm.id === selectedElmId)?.property.label}
                                onChange={(e) => setElms((prev) =>
                                    prev.map((elm) => elm.id === selectedElmId
                                        ? { ...elm, property: { ...elm.property, label: e.target.value } }
                                        : elm
                                    )
                                )}
                                required
                            />
                        </label>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <span>タイプ</span>
                            <select
                                className={[
                                    "block w-full p-2.5",
                                    "bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-300",
                                    "focus:ring-blue-500 focus:border-blue-500",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
                                    "dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                ].join(" ")}
                                value={elms.find((elm) => elm.id === selectedElmId)?.property.type}
                                onChange={(e) => setElms((prev) =>
                                    prev.map((elm) => elm.id === selectedElmId
                                        ? { ...elm, property: { ...elm.property, type: e.target.value } }
                                        : elm
                                    )
                                )}
                            >
                                <option value="text">text</option>
                                <option value="number">number</option>
                                <option value="date">date</option>
                                <option value="password">password</option>
                                <option value="file">file</option>
                            </select>
                        </label>
                        <button
                            type="button"
                            className={[
                                "px-4 py-2",
                                "bg-red-500 text-white rounded-md",
                                "hover:bg-red-600",
                            ].join(" ")}
                            onClick={() => {
                                deleteElm(selectedElmId);
                                setSelectedElmId(null);
                            }}
                        >
                            削除
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;