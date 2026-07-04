"use client";

import { Menu, Plus, StickyNote, Trash2 } from "lucide-react";
import type { TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    isEditing: boolean;
    isRoot: boolean;
    isDragging: boolean;
    saveEdit: () => void;
    cancelEdit: () => void;
    openNote: (node: TaskWithCalc) => void;
    addChild: (parentId: string | null) => void;
    deleteNode: (id: string) => void;
    handlePointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
};

const TaskMenu = ({
    node,
    isEditing,
    isRoot,
    isDragging,
    saveEdit,
    cancelEdit,
    openNote,
    addChild,
    deleteNode,
    handlePointerDown,
}: Props) => {
    if (isEditing) {
        return (
            <div className="flex-2 flex gap-2 justify-end select-none">
                <button type="button" onClick={saveEdit} className="text-green-600 text-sm">
                    確定
                </button>
                <button type="button" onClick={cancelEdit} className="text-gray-500 text-sm">
                    キャンセル
                </button>
            </div>
        );
    } else {
        return (
            <div className="flex-2 flex justify-end lg:gap-4 gap-2">
                <button type="button" className="size-4 cursor-pointer anchor-scope group" onClick={() => openNote(node)}>
                    <div className="relative anchor">
                        <StickyNote className="size-full text-gray-500" />
                        {node.notes && (
                            <span
                                className={[
                                    "top-[-3] start-2.5 absolute w-2.5 h-2.5",
                                    "bg-green-500 border-2 border-white rounded-full",
                                    "dark:border-gray-800",
                                ].join(" ")}
                            />
                        )}
                    </div>
                    <span
                        className={[
                            "hidden p-1 z-100",
                            "bg-gray-500 text-white text-nowrap rounded-md",
                            "group-hover:block after:",
                            "popover",
                        ].join(" ")}
                    >
                        備考
                    </span>
                </button>
                <button type="button" className="size-4 cursor-pointer anchor-scope group" onClick={() => addChild(node.id)}>
                    <Plus className="size-full text-blue-600 relative anchor" />
                    <span
                        className={[
                            "hidden p-1 z-100",
                            "bg-gray-500 text-white text-nowrap rounded-md",
                            "group-hover:block after:",
                            "popover",
                        ].join(" ")}
                    >
                        子タスク追加
                    </span>
                </button>
                {!isRoot && (
                    <button type="button" className="size-4 cursor-pointer anchor-scope group" onClick={() => deleteNode(node.id)}>
                        <Trash2 className="size-full text-red-600 relative anchor" />
                        <span
                            className={[
                                "hidden p-1 z-100",
                                "bg-gray-500 text-white text-nowrap rounded-md",
                                "group-hover:block after:",
                                "popover",
                            ].join(" ")}
                        >
                            削除
                        </span>
                    </button>
                )}
                <div onPointerDown={(e) => handlePointerDown(e, node.id)}>
                    <Menu
                        className={[
                            "size-4 active:cursor-grabbing",
                            `${isDragging ? "" : "cursor-grab"}`,
                        ].join(" ")}
                    />
                </div>
            </div>
        );
    }
};

export default TaskMenu;