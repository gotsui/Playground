"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, CircleX, Eye, ListFilter, PlusCircle } from "lucide-react";

import WbsFilter from "./WbsFilter";
import WbsHeader from "./WbsHeader";
import WbsNoteModal from "./WbsNoteModal";
import WbsRow from "./WbsRow";
import { useWbs } from "../_hooks/useWbs";
import {
    idSchema,
    taskNodeSchema,
} from "../_lib/schema";
import { ColumnFilterKey, TaskNode, WbsFilterMap } from "../_lib/types";
import { depthFirstSearch, hasDifference } from "../_lib/utils";
import "../style.css";
import ColumnFilterModal from "./ColumnFilterModal";
import ItemFilterModal from "./ItemFilterModal";

type Props = {
    initialTaskNode: TaskNode;
};

const WbsLayout = ({
    initialTaskNode,
}: Props) => {
    const { id } = useParams();
    const wbsId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    const [savedTask, setSavedTask] = useState(initialTaskNode);
    const [draggingId, setDraggingId] = useState("");

    const [hiddenColumnFilterModal, setHiddenColumnModal] = useState(true);
    const [hiddenColumnSet, setHiddenColumnSet] = useState<Set<ColumnFilterKey>>(new Set());
    const [hiddenItenFilterModal, setHiddenItemModal] = useState(true);
    const [filterMap, setFilterMap] = useState<WbsFilterMap>(new Map());

    const {
        calcedRoot,
        ccpmMode,
        toggleCcpmMode,
        expanded,
        toggleExpand,
        editingId,
        editForm,
        startEdit,
        saveEdit,
        updateForm,
        cancelEdit,
        addChild,
        deleteNode,
        noteNode,
        openNote,
        closeNote,
        moveNode,
        updateNode,
    } = useWbs(initialTaskNode);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        setDraggingId(id);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (!draggingId || id === draggingId) {
            setDraggingId("");
            return;
        }

        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;

        if (relativeY < rect.height / 3) {
            moveNode(draggingId, id, "upper");
        } else if (relativeY < rect.height * 2 / 3) {
            moveNode(draggingId, id, "middle");
        } else {
            moveNode(draggingId, id, "lower");
        }

        setDraggingId("");
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (!draggingId) return;

        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;

        // if (relativeY < rect.height / 4) {
        //     e.currentTarget.style.backgroundColor = "red";
        // } else if (relativeY < rect.height * 3 / 4) {
        //     if (id === draggingId) {
        //         e.currentTarget.style.backgroundColor = "";
        //     } else {
        //         e.currentTarget.style.backgroundColor = "yellow";
        //     }
        // } else {
        //     e.currentTarget.style.backgroundColor = "blue";
        // }
    }

    const handleClickSave = async () => {
        const parsedTasks = taskNodeSchema.safeParse(calcedRoot);

        if (!parsedTasks.success) {
            console.error(parsedTasks.error);
            return;
        }

        const res = await fetch("/api/wbs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: calcedRoot.name,
                nodes: parsedTasks.data,
            }),
        });

        if (!res.ok) {
            console.error(await res.json());
            alert("保存に失敗しました");
            return;
        }

        const { wbsId } = await res.json();
        const parsedId = idSchema.safeParse(wbsId);

        if (parsedId.success) {
            router.push(`/wbs/${parsedId.data}`);
        } else {
            console.error(parsedId.error);
        }
    };

    const handleClickUpdate = async (wbsId: string) => {
        if (!hasDifference(savedTask, calcedRoot)) {
            return;
        }

        const parsedId = idSchema.safeParse(wbsId);
        const parsedTasks = taskNodeSchema.safeParse(calcedRoot);

        if (!parsedId.success || !parsedTasks.success) {
            console.error(parsedId.error);
            console.error(parsedTasks.error);
            return;
        }

        const res = await fetch(`/api/wbs/${parsedId.data}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: calcedRoot.name,
                nodes: parsedTasks.data,
            }),
        });

        if (!res.ok) {
            console.error(await res.json());
            alert("保存に失敗しました");
            return;
        }

        setSavedTask(parsedTasks.data);
        alert("保存しました");
    };

    const handleClickDownload = () => {
        const fileNameWithJson = `wbs-${calcedRoot.name}.json`;
        const blobData = new Blob([JSON.stringify(calcedRoot, null, "\t")], { type: "text/json" });
        const jsonURL = URL.createObjectURL(blobData);

        const linkElement = document.createElement("a");
        linkElement.href = jsonURL;
        linkElement.download = fileNameWithJson;

        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        URL.revokeObjectURL(jsonURL);
    };

    return (
        <div className="h-screen bg-gray-100 overflow-auto">
            <WbsHeader
                name={calcedRoot.name}
                ccpmMode={ccpmMode}
                onToggleCcpm={toggleCcpmMode}
                totalHours={calcedRoot.totalWithBuffer}
                projectBuffer={ccpmMode ? calcedRoot.buffer : undefined}
                onClickSave={wbsId ? () => handleClickUpdate(wbsId) : handleClickSave}
                onClickDownload={handleClickDownload}
            />
            <div className="flex items-center max-w-7xl mx-auto px-8 py-1 gap-4">
                <div className="flex items-center gap-1">
                    <PlusCircle className="size-4" />
                    <span>追加</span>
                </div>
                <div className="flex items-center gap-1">
                    <CircleX className="size-4" />
                    <span>削除</span>
                </div>
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setHiddenColumnModal(false)}
                >
                    <Eye className="size-4" />
                    <span>表示</span>
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setHiddenItemModal(false)}
                >
                    <ListFilter className="size-4" />
                    <span>フィルター</span>
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                        expanded.forEach((id) => {
                            toggleExpand(id);
                        });
                        toggleExpand(calcedRoot.id);
                    }}
                >
                    <ChevronUp className="size-4" />
                    <span>折りたたみ</span>
                </button>
                <button
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                        for (const node of depthFirstSearch(calcedRoot)) {
                            if (!expanded.has(node.id)) {
                                toggleExpand(node.id);
                            }
                        }
                    }}
                >
                    <ChevronDown className="size-4" />
                    <span>展開</span>
                </button>
            </div>
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 font-bold text-sm bg-blue-50 py-4 px-8 border-b-2 border-gray-200">
                        <div className="col-span-4">タスク名</div>
                        <div className="col-span-1 text-right">主担当</div>
                        <div className="col-span-1 text-right">ステータス</div>
                        <div className="col-span-1 text-right">予定工数</div>
                        <div className="col-span-1 text-right">バッファ</div>
                        <div className="col-span-1 text-right">バッファ込み</div>
                        <div className="col-span-1 text-right">小計</div>
                        <div className="col-span-2 text-right" />
                    </div>
                    <WbsRow
                        node={calcedRoot}
                        depth={0}
                        ccpmMode={ccpmMode}
                        isRoot={true}
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
                        isDragging={draggingId != ""}
                        handlePointerDown={handlePointerDown}
                        handlePointerUp={handlePointerUp}
                        handlePointerMove={handlePointerMove}
                        filterMap={filterMap}
                    />
                </div>
            </div>
            <WbsNoteModal node={noteNode} updateNode={updateNode} onClose={closeNote} />
            {!hiddenColumnFilterModal && (
                <ColumnFilterModal
                    hiddenColumnSet={hiddenColumnSet}
                    setHiddenColumnSet={setHiddenColumnSet}
                    onClose={() => setHiddenColumnModal(true)}
                />
            )}
            {!hiddenItenFilterModal && (
                <ItemFilterModal
                    node={calcedRoot}
                    filterMap={filterMap}
                    setFilterMap={setFilterMap}
                    onClose={() => setHiddenItemModal(true)}
                />
            )}
        </div>
    );
};

export default WbsLayout;