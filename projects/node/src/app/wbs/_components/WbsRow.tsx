import {
    ChevronDown,
    ChevronRight,
    Dot,
    Menu,
    Plus,
    StickyNote,
    Trash2,
} from "lucide-react";

import { EditingRow, TaskWithCalc } from "../_lib/types";

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
}: Props) => {
    const isEditing = editingId === node.id;
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children.length > 0;
    const withBuffer = node.effort + node.buffer;
    const paddingLeft = depth * 24;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <div
                className={
                    `grid grid-cols-12 gap-4 items-center py-3 px-6 border-b hover:bg-gray-50 transition-colors ${
                        isEditing ? "bg-blue-50" : ""
                    }`
                }
                onDoubleClick={() => startEdit(node)}
                onDragOver={handleDragOver}
                draggable={true}
            >
                {isEditing ? (
                    <>
                        <div className="col-span-4 flex items-center">
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
                                className="size-full border rounded-md px-2 py-1"
                                value={editForm?.name || ""}
                                onChange={(e) => updateForm({ name: e.target.value })}
                            />
                        </div>
                        <input
                            className="col-span-1 border rounded-md px-2 py-1"
                            value={editForm?.assignee || ""}
                            onChange={(e) => updateForm({ assignee: e.target.value })}
                        />
                        <select
                            className="col-span-1 border rounded-md px-2 py-1"
                            value={editForm?.status || "新規"}
                            onChange={(e) => updateForm({ status: e.target.value })}
                        >
                            <option>新規</option>
                            <option>進行中</option>
                            <option>完了</option>
                        </select>
                        <input
                            className={`col-span-1 border rounded-md px-2 y-1 text-right ${ccpmMode && isRoot ? "bg-gray-200" : ""}`}
                            value={ccpmMode && isRoot ? "0" : editForm?.effort}
                            disabled={ccpmMode && isRoot}
                            onChange={(e) => updateForm({ effort: e.target.value })}
                        />
                        <input
                            className="col-span-1 border rounded-md px-2 py-1 text-right"
                            value={editForm?.buffer || ""}
                            onChange={(e) => updateForm({ buffer: e.target.value })}
                        />
                        <div className="col-span-1 text-right font-bold text-green-600">
                            {withBuffer} h
                        </div>
                        {hasChildren ? (
                            <div className="col-span-1 text-right text-sm text-gray-600">
                                計 {node.totalWithBuffer} h
                            </div>
                        ) : (
                            <div className="col-span-1" />
                        )}
                        <div className="col-span-2 flex gap-2 justify-end">
                            <button onClick={saveEdit} className="text-green-600 text-sm">
                                保存
                            </button>
                            <button onClick={cancelEdit} className="text-gray-500 text-sm">
                                キャンセル
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-4 flex items-center">
                            {hasChildren ? (
                                <button
                                    className="p-1 ml-1"
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
                            {/* {ccpmMode && isRoot && <span className="ml-3 text-purple-600 font-bold text-sm">[CCPMモード]</span>} */}
                        </div>
                        <div className="col-span-1 text-right">
                            {node.assignee && <span className="text-gray-500 text-sm ml-2">({node.assignee})</span>}
                        </div>
                        <div className="col-span-1 text-right">
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-md mr-2 ${
                                node.status === "完了" ? "bg-green-100 text-green-800" :
                                node.status === "進行中" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-600"
                            }`}>
                                {node.status}
                            </span>
                        </div>
                        <div className="col-span-1 text-right">
                            {node.effort} h
                        </div>
                        <div className="col-span-1 text-right">
                            {node.buffer} h
                        </div>
                        <div className="col-span-1 text-right">
                            <strong className="text-green-600">{withBuffer} h</strong>
                        </div>
                        {hasChildren ? (
                            <div className="col-span-1 text-right text-sm text-gray-600">
                                計 {node.totalWithBuffer} h
                            </div>
                        ) : (
                            <div className="col-span-1" />
                        )}
                        <div className="col-span-2 flex justify-end gap-4">
                            {node.notes && (
                                <button onClick={() => openNote(node)}>
                                    <StickyNote className="size-4 text-gray-500" />
                                </button>
                            )}
                            <button onClick={() => addChild(node.id)}>
                                <Plus className="size-4 text-blue-600 cursor-pointer" />
                            </button>
                            {!isRoot && (
                                <button onClick={() => deleteNode(node.id)}>
                                    <Trash2 className="size-4 text-red-600 cursor-pointer" />
                                </button>
                            )}
                            <div>
                                <Menu className="size-4 cursor-grab active:cursor-grabbing" />
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
                />
            ))}
        </>
    );
};

export default WbsRow;