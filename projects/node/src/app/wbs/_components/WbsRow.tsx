"use client"

import type { ColumnFilterKey, EditingRow, TaskWithCalc } from "../_lib/types";
import PlannedEffort from "./columns/PlannedEffort";
import PlannedBuffer from "./columns/PlannedBuffer";
import TaskStatus from "./columns/TaskStatus";
import PlannedEffortWithBuffer from "./columns/PlannedEffortWithBuffer";
import ActualEffort from "./columns/ActualEffort";
import TaskAssignee from "./columns/TaskAssignee";
import PlannedStartDate from "./columns/PlannedStartDate";
import PlannedEndDate from "./columns/PlannedEndDate";
import ActualStartDate from "./columns/ActualStartDate";
import ActualEndDate from "./columns/ActualEndDate";
import TaskMenu from "./columns/TaskMenu";
import TaskName from "./columns/TaskName";

type Props = {
    node: TaskWithCalc;
    depth: number;
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
                <TaskName
                    node={node}
                    depth={depth}
                    isEditing={isEditing}
                    editForm={editForm}
                    expanded={expanded}
                    updateForm={updateForm}
                    toggleExpand={toggleExpand}
                />
                <TaskStatus
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("status")}
                />
                <PlannedEffort
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("plannedEffort")}
                />
                <PlannedBuffer
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("buffer")}
                />
                <PlannedEffortWithBuffer
                    node={node}
                    isVisible={!hiddenColumnSet.has("withBuffer")}
                />
                <ActualEffort
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("actualEffort")}
                />
                <TaskAssignee
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("assignee")}
                />
                <PlannedStartDate
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("plannedStartDate")}
                />
                <PlannedEndDate
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("plannedEndDate")}
                />
                <ActualStartDate
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("actualStartDate")}
                />
                <ActualEndDate
                    node={node}
                    editForm={editForm}
                    updateForm={updateForm}
                    isEditing={isEditing}
                    isVisible={!hiddenColumnSet.has("actualEndDate")}
                />
                <TaskMenu
                    node={node}
                    isEditing={isEditing}
                    isRoot={isRoot}
                    isDragging={isDragging}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    openNote={openNote}
                    addChild={addChild}
                    deleteNode={deleteNode}
                    handlePointerDown={handlePointerDown}
                />
            </div>
            {isExpanded && node.children.map((child) => (
                <WbsRow
                    key={child.id}
                    node={child as TaskWithCalc}
                    depth={depth + 1}
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