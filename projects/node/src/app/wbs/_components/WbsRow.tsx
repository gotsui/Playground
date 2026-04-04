import {
    ChevronDown,
    ChevronRight,
    Dot,
    Menu,
    Plus,
    StickyNote,
    Trash2,
} from "lucide-react";

import type { ColumnFilterKey, EditingRow, TaskWithCalc } from "../_lib/types";

type Props = {
    node: TaskWithCalc;
    depth: number;
    ccpmMode: boolean;
    isRoot: boolean;
    editingId: string | null;
    editForm: EditingRow | null;
    expanded: Set<string>;
    toggleExpand: (id: string) => void;
    startEdit: (node: TaskWithCalc) => void;
    saveEdit: () => void;
    updateForm: (updates: Partial<EditingRow>) => void;
    cancelEdit: () => void;
    addChild: (parentId: string | null) => void;
    deleteNode: (id: string) => void;
    openNote: (node: TaskWithCalc) => void;
    isDragging: boolean;
    handlePointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
    handlePointerUp: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
    handlePointerMove: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
    hiddenNodeIdSet: Set<string>;
    hiddenColumnSet: Set<ColumnFilterKey>;
};

const WbsRow = ({
    node,
    depth,
    ccpmMode,
    isRoot,
    editingId,
    editForm,
    expanded,
    toggleExpand,
    startEdit,
    saveEdit,
    updateForm,
    cancelEdit,
    addChild,
    deleteNode,
    openNote,
    isDragging,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    hiddenNodeIdSet,
    hiddenColumnSet,
}: Props) => {
    if (hiddenNodeIdSet.has(node.id)) {
        return null;
    }

    const isEditing = editingId === node.id;
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children.length > 0;
    const withBuffer = node.plannedEffort + node.buffer;
    const paddingLeft = depth * 24;

    return (
        <>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: ドラッグ操作による機能のため */}
            <div
                className={[
                    "flex gap-4 items-center py-3 px-6 border-t text-sm",
                    "hover:bg-gray-50 transition-colors",
                    `${isEditing ? "bg-blue-50" : ""}`,
                    `${isDragging ? "select-none" : "select-text"}`,
                ].join(" ")}
                onDoubleClick={() => startEdit(node)}
                onPointerUp={(e) => handlePointerUp(e, node.id)}
                onPointerMove={(e) => handlePointerMove(e, node.id)}
            >
                {isEditing ? (
                    <>
                        <div className="flex-4 flex items-center">
                            {hasChildren ? (
                                <div
                                    className="p-1 ml-1"
                                    style={{ paddingLeft: `${paddingLeft}px` }}
                                >
                                    {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                                </div>
                            ) : (
                                <div
                                    style={{ paddingLeft: `${paddingLeft}px` }}
                                >
                                    <Dot className="size-7" />
                                </div>
                            )}
                            <input
                                className="w-full border rounded-md px-2 py-1"
                                value={editForm?.name || ""}
                                onChange={(e) => updateForm({ name: e.target.value })}
                            />
                        </div>
                        {!hiddenColumnSet.has("status") && (
                            <div className="flex-1">
                                <select
                                    className="w-full border rounded-md px-2 py-1.5"
                                    value={editForm?.status || "新規"}
                                    onChange={(e) => updateForm({ status: e.target.value })}
                                >
                                    <option>新規</option>
                                    <option>進行中</option>
                                    <option>完了</option>
                                </select>
                            </div>
                        )}
                        {!hiddenColumnSet.has("plannedEffort") && (
                            <div className="flex-1">
                                <input
                                    className={`w-full border rounded-md px-2 py-1 text-right ${ccpmMode && isRoot ? "bg-gray-200" : ""}`}
                                    value={ccpmMode && isRoot ? "0" : editForm?.plannedEffort}
                                    disabled={ccpmMode && isRoot}
                                    onChange={(e) => updateForm({ plannedEffort: e.target.value })}
                                />
                            </div>
                        )}
                        {!hiddenColumnSet.has("buffer") && (
                            <div className="flex-1">
                                <input
                                    className="w-full border rounded-md px-2 py-1 text-right"
                                    value={editForm?.buffer || ""}
                                    onChange={(e) => updateForm({ buffer: e.target.value })}
                                />
                            </div>
                        )}
                        {!hiddenColumnSet.has("withBuffer") && (
                            <div className="flex-1 text-right font-bold text-green-600">
                                {withBuffer} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("totalWithBuffer") && hasChildren && (
                            <div className="flex-1 text-right text-gray-600">
                                計 {node.totalWithBuffer} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("totalWithBuffer") && !hasChildren && (
                            <div className="flex-1" />
                        )}
                        {!hiddenColumnSet.has("actualEffort") && (
                            <div className="flex-1">
                                <input
                                    className="w-full border rounded-md px-2 py-1 text-right"
                                    value={editForm?.actualEffort || ""}
                                    onChange={(e) => updateForm({ actualEffort: e.target.value })}
                                />
                            </div>
                        )}
                        {!hiddenColumnSet.has("assignee") && (
                            <div className="flex-1">
                                <input
                                    className="w-full border rounded-md px-2 py-1"
                                    value={editForm?.assignee || ""}
                                    onChange={(e) => updateForm({ assignee: e.target.value })}
                                />
                            </div>
                        )}
                        {!hiddenColumnSet.has("startDate") && (
                            <div className="flex-1">
                                <input
                                    className="w-full border rounded-md px-2 py-1"
                                    value={editForm?.startDate || ""}
                                    onChange={(e) => updateForm({ startDate: e.target.value })}
                                />
                            </div>
                        )}
                        {!hiddenColumnSet.has("endDate") && (
                            <div className="flex-1">
                                <input
                                    className="w-full border rounded-md px-2 py-1"
                                    value={editForm?.endDate || ""}
                                    onChange={(e) => updateForm({ endDate: e.target.value })}
                                />
                            </div>
                        )}
                        <div className="flex-2 flex gap-2 justify-end">
                            <button type="button" onClick={saveEdit} className="text-green-600 text-sm">
                                保存
                            </button>
                            <button type="button" onClick={cancelEdit} className="text-gray-500 text-sm">
                                キャンセル
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-4 flex items-center">
                            {hasChildren ? (
                                <button
                                    type="button"
                                    className="p-1 ml-1 cursor-pointer"
                                    onClick={() => toggleExpand(node.id)}
                                    style={{ paddingLeft: `${paddingLeft}px` }}
                                >
                                    {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                                </button>
                            ) : (
                                <div
                                    style={{ paddingLeft: `${paddingLeft}px` }}
                                >
                                    <Dot className="size-7" />
                                </div>
                            )}
                            <span className="font-medium">{node.name}</span>
                        </div>
                        {!hiddenColumnSet.has("status") && (
                            <div className="flex-1 text-center">
                                <span className={`inline-block w-4/5 text-center text-nowrap py-0.5 rounded-md ${
                                    node.status === "完了" ? "bg-green-100 text-green-800" :
                                    node.status === "進行中" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-600"
                                }`}>
                                    {node.status}
                                </span>
                            </div>
                        )}
                        {!hiddenColumnSet.has("plannedEffort") && (
                            <div className="flex-1 text-right">
                                {node.plannedEffort} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("buffer") && (
                            <div className="flex-1 text-right">
                                {node.buffer} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("withBuffer") && (
                            <div className="flex-1 text-right">
                                <strong className="text-green-600">{withBuffer} h</strong>
                            </div>
                        )}
                        {!hiddenColumnSet.has("totalWithBuffer") && hasChildren && (
                            <div className="flex-1 text-right text-gray-600">
                                計 {node.totalWithBuffer} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("totalWithBuffer") && !hasChildren && (
                            <div className="flex-1" />
                        )}
                        {!hiddenColumnSet.has("actualEffort") && (
                            <div className="flex-1 text-right">
                                {node.actualEffort} h
                            </div>
                        )}
                        {!hiddenColumnSet.has("assignee") && (
                            <div className="flex-1 text-center">
                                {node.assignee && <span className="text-gray-500 ml-2">{node.assignee}</span>}
                            </div>
                        )}
                        {!hiddenColumnSet.has("startDate") && (
                            <div className="flex-1 text-center">
                                {node.assignee && (
                                    <span className="text-gray-500 ml-2">
                                        {node.startDate?.toLocaleDateString("ja-JP", {
                                            timeZone: "Asia/Tokyo",
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </span>
                                )}
                            </div>
                        )}
                        {!hiddenColumnSet.has("endDate") && (
                            <div className="flex-1 text-center">
                                {node.assignee && (
                                    <span className="text-gray-500 ml-2">
                                        {node.endDate?.toLocaleDateString("ja-JP", {
                                            timeZone: "Asia/Tokyo",
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex-2 flex justify-end gap-4">
                            <button type="button" className="relative" onClick={() => openNote(node)}>
                                <StickyNote className="size-4 text-gray-500 cursor-pointer" />
                                {node.notes && (
                                    <span
                                        className={[
                                            "top-[-3] start-2.5 absolute w-2.5 h-2.5",
                                            "bg-green-500 border-2 border-white rounded-full",
                                            "dark:border-gray-800",
                                        ].join(" ")}
                                    />
                                )}
                            </button>
                            <button type="button" onClick={() => addChild(node.id)}>
                                <Plus className="size-4 text-blue-600 cursor-pointer" />
                            </button>
                            {!isRoot && (
                                <button type="button" onClick={() => deleteNode(node.id)}>
                                    <Trash2 className="size-4 text-red-600 cursor-pointer" />
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
                    </>
                )}
            </div>
            {isExpanded && node.children.map((child) => (
                <WbsRow
                    key={child.id}
                    node={child as TaskWithCalc}
                    depth={depth + 1}
                    ccpmMode={ccpmMode}
                    isRoot={false}
                    editingId={editingId}
                    editForm={editForm}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    startEdit={startEdit}
                    saveEdit={saveEdit}
                    updateForm={updateForm}
                    cancelEdit={cancelEdit}
                    addChild={addChild}
                    deleteNode={deleteNode}
                    openNote={openNote}
                    isDragging={isDragging}
                    handlePointerDown={handlePointerDown}
                    handlePointerUp={handlePointerUp}
                    handlePointerMove={handlePointerMove}
                    hiddenNodeIdSet={hiddenNodeIdSet}
                    hiddenColumnSet={hiddenColumnSet}
                />
            ))}
        </>
    );
};

export default WbsRow;