"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Eye, History, ListFilter, Users } from "lucide-react";

import WbsHeader from "./WbsHeader";
import WbsNoteModal from "./WbsNoteModal";
import WbsRow from "./WbsRow";
import ColumnFilter from "./modal/ColumnFilter";
import Dialog from "./modal/Dialog";
import ItemFilter from "./modal/ItemFilter";
import UpdateHistory from "./modal/UpdateHistory"
import { useBoolean } from "../_hooks/useBoolean";
import { useWbs } from "../_hooks/useWbs";
import { idSchema, taskNodeSchema } from "../_lib/schema";
import type { ColumnFilterKey, TaskNode, WbsFilterMap, WbsRole } from "../_lib/types";
import { depthFirstSearch, filterNode, hasDifference } from "../_lib/utils";
import "../style.css";
import MemberList from "./modal/MemberList";

type DragRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

type Props = {
    initialTaskNode: TaskNode;
    wbsRole: WbsRole;
};

const WbsLayout = ({
    initialTaskNode,
    wbsRole,
}: Props) => {
    const { id } = useParams();
    const wbsId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    // ドラッグ
    const [savedTask, setSavedTask] = useState(initialTaskNode);
    const [draggingId, setDraggingId] = useState("");
    const [rect, setRect] = useState<DragRect | null>(null);

    // フィルター
    const [hiddenColumnSet, setHiddenColumnSet] = useState<Set<ColumnFilterKey>>(new Set());
    const [filterMap, setFilterMap] = useState<WbsFilterMap>(new Map());
    const [ignoreChildren, setIgnoreChildren] = useState(false);

    // モーダル
    const [isOpenColumnFilter, columnFilterHandler] = useBoolean();
    const [isOpenItemFilter, itemFilterHandler] = useBoolean();
    const [isOpenHistory, historyHandler] = useBoolean();
    const [isOpenMemberList, memberListHandler] = useBoolean();

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
        findNode,
    } = useWbs(initialTaskNode);

    const isShownNode = useCallback(
        (node: TaskNode) => {
            for (const [key, value] of filterMap.entries()) {
                if (value.has(node[key]?.toString() || "")) {
                    return false;
                }
            }

            return true;
        },
        [filterMap],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: フィルターが変更されるまで更新したくないためcalcedRootは依存配列に含めない
    const hiddenNodeIdSet: Set<string> = useMemo(
        () => {
            const filtered = filterNode(calcedRoot, isShownNode, ignoreChildren);
            const filteredNodeIdSet: Set<string> = filtered
                ? new Set([...depthFirstSearch(filtered)].map((node) => node.id))
                : new Set();
            const allNodeIdSet = new Set([...depthFirstSearch(calcedRoot)].map((node) => node.id));
            const diffSet = allNodeIdSet.difference(filteredNodeIdSet);
            return diffSet;
        },
        [isShownNode, ignoreChildren],
    );

    const handlePointerDown = (_e: React.PointerEvent<HTMLDivElement>, id: string) => {
        setDraggingId(id);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (!draggingId || !id || id === draggingId) {
            setDraggingId("");
            setRect(null);
            return;
        }

        const draggingNode = findNode(calcedRoot, draggingId);

        // 親ノードを子ノードに移動不可
        if (draggingNode && findNode(draggingNode, id)) {
            setDraggingId("");
            setRect(null);
            return
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
        setRect(null);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (!draggingId || id === draggingId) {
            setRect(null);
            return
        };

        const draggingNode = findNode(calcedRoot, draggingId);

        if (draggingNode && findNode(draggingNode, id)) {
            setRect(null);
            return
        }

        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;

        if (id === calcedRoot.id) {
            setRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        }else if (relativeY < rect.height / 3) {
            setRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height / 4,
            });
        } else if (relativeY < rect.height * 2 / 3) {
            setRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        } else {
            setRect({
                top: rect.top + rect.height * 3 / 4,
                left: rect.left,
                width: rect.width,
                height: rect.height / 4,
            });
        }
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
        <div className="size-full flex flex-col bg-gray-100 pb-4" onPointerUp={(e) => handlePointerUp(e, "")}>
            <WbsHeader
                name={calcedRoot.name}
                ccpmMode={ccpmMode}
                onToggleCcpm={toggleCcpmMode}
                totalHours={calcedRoot.totalWithBuffer}
                projectBuffer={ccpmMode ? calcedRoot.buffer : undefined}
                onClickSave={wbsId ? () => handleClickUpdate(wbsId) : handleClickSave}
                onClickDownload={handleClickDownload}
                wbsRole={wbsRole}
            />
            <div className="flex items-center max-w-7xl w-full mx-auto px-12 py-1 gap-4">
                <button
                    type="button"
                    className="relative flex items-center gap-1 cursor-pointer"
                    onClick={columnFilterHandler.setTrue}
                >
                    <Eye className="size-4" />
                    <span>表示</span>
                    {hiddenColumnSet.size > 0 && (
                        <span
                            className={[
                                "top-0 start-2.5 absolute w-2.5 h-2.5",
                                "bg-green-500 border-2 border-white rounded-full",
                                "dark:border-gray-800",
                            ].join(" ")}
                        />
                    )}
                </button>
                <Dialog isOpen={isOpenColumnFilter} close={columnFilterHandler.setFalse}>
                    <ColumnFilter
                        closeDialog={columnFilterHandler.setFalse}
                        hiddenColumnSet={hiddenColumnSet}
                        setHiddenColumnSet={setHiddenColumnSet}
                    />
                </Dialog>
                <button
                    type="button"
                    className="relative flex items-center gap-1 cursor-pointer"
                    onClick={itemFilterHandler.setTrue}
                >
                    <ListFilter className="size-4" />
                    <span>フィルター</span>
                    {filterMap.values().some((set) => set.size > 0) && (
                        <span
                            className={[
                                "top-0 start-2.5 absolute w-2.5 h-2.5",
                                "bg-green-500 border-2 border-white rounded-full",
                                "dark:border-gray-800",
                            ].join(" ")}
                        />
                    )}
                </button>
                <Dialog isOpen={isOpenItemFilter} close={itemFilterHandler.setFalse}>
                    <ItemFilter
                        key={String(isOpenItemFilter)}
                        rootNode={calcedRoot}
                        filterMap={filterMap}
                        setFilterMap={setFilterMap}
                        ignoreChildren={ignoreChildren}
                        setIgnoreChildren={setIgnoreChildren}
                    />
                </Dialog>
                <button
                    type="button"
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
                    type="button"
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
                {wbsId && (
                    <>
                        <button
                            type="button"
                            className="relative flex items-center gap-1 cursor-pointer"
                            onClick={historyHandler.setTrue}
                        >
                            <History className="size-4" />
                            <span>履歴</span>
                        </button>
                        <Dialog isOpen={isOpenHistory} close={historyHandler.setFalse}>
                            <UpdateHistory
                                key={String(isOpenHistory)}
                                wbsId={wbsId || ""}
                            />
                        </Dialog>
                    </>
                )}
                {wbsId && (wbsRole === "owner" || wbsRole === "admin") && (
                    <>
                        <button
                            type="button"
                            className="relative flex items-center gap-1 cursor-pointer"
                            onClick={memberListHandler.setTrue}
                        >
                            <Users className="size-4" />
                            <span>メンバー</span>
                        </button>
                        <Dialog isOpen={isOpenMemberList} close={memberListHandler.setFalse}>
                            <MemberList
                                key={String(isOpenMemberList)}
                                wbsId={wbsId || ""}
                            />
                        </Dialog>
                    </>
                )}
            </div>
            <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto overflow-hidden px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-auto">
                    <div className="sticky z-50 top-0 flex gap-4 font-bold text-sm bg-blue-50 py-4 px-8 border-b-2 border-gray-200">
                        <div className="flex-4">タスク名</div>
                        {!hiddenColumnSet.has("status") && (
                            <div className="flex-1 text-center">ステータス</div>
                        )}
                        {!hiddenColumnSet.has("plannedEffort") && (
                            <div className="flex-1 text-right">予定工数</div>
                        )}
                        {!hiddenColumnSet.has("buffer") && (
                            <div className="flex-1 text-right">バッファ</div>
                        )}
                        {!hiddenColumnSet.has("withBuffer") && (
                            <div className="flex-1 text-right">バッファ込み</div>
                        )}
                        {!hiddenColumnSet.has("totalWithBuffer") && (
                            <div className="flex-1 text-right">小計</div>
                        )}
                        {!hiddenColumnSet.has("actualEffort") && (
                            <div className="flex-1 text-right">実績工数</div>
                        )}
                        {!hiddenColumnSet.has("assignee") && (
                            <div className="flex-1 text-center">主担当</div>
                        )}
                        {!hiddenColumnSet.has("plannedStartDate") && (
                            <div className="flex-1 text-center">開始予定日</div>
                        )}
                        {!hiddenColumnSet.has("plannedEndDate") && (
                            <div className="flex-1 text-center">終了予定日</div>
                        )}
                        {!hiddenColumnSet.has("actualStartDate") && (
                            <div className="flex-1 text-center">開始実績日</div>
                        )}
                        {!hiddenColumnSet.has("actualEndDate") && (
                            <div className="flex-1 text-center">終了実績日</div>
                        )}
                        <div className="flex-2 text-right" />
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
                        isDragging={draggingId !== ""}
                        handlePointerDown={handlePointerDown}
                        handlePointerUp={handlePointerUp}
                        handlePointerMove={handlePointerMove}
                        hiddenNodeIdSet={hiddenNodeIdSet}
                        hiddenColumnSet={hiddenColumnSet}
                    />
                </div>
            </div>
            {noteNode && (
                <WbsNoteModal node={noteNode} updateNode={updateNode} onClose={closeNote} />
            )}
            <div
                className="fixed bg-indigo-300/50 pointer-events-none"
                style={{ ...rect }}
            />
        </div>
    );
};

export default WbsLayout;