"use client";

import { useState } from "react";

import { statusSchema, taskNodeSchema } from "../_lib/schema";
import type { EditingRow, TaskNode } from "../_lib/types";
import { calcTotals, depthFirstSearch, generateId } from "../_lib/utils";
import { dateToString } from "@/lib/date";

export const createNode = (name?: string): TaskNode => {
    return {
        id: generateId(),
        name: name || "",
        status: "新規",
        plannedEffort: 0,
        buffer: 0,
        actualEffort: 0,
        children: [],
    };
};

export const useWbs = (initialTaskNode: TaskNode) => {
    const [wbs, setWbs] = useState<TaskNode>(initialTaskNode);
    const [ccpmMode, setCcpmMode] = useState(false);
    const [expanded, setExpanded] = useState<Set<string>>(new Set([...depthFirstSearch(initialTaskNode)].map((node) => node.id)));
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditingRow | null>(null);
    const [noteNode, setNoteNode] = useState<TaskNode | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const calcedRoot = calcTotals(wbs);

    const toggleCcpmMode = (enabled: boolean) => {
        setCcpmMode(enabled);

        if (enabled) {
            // ルートのeffortを0に強制
            setWbs((prev) => ({ ...prev, effort: 0 }));
        }
    };

    const toggleExpand = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const findAndUpdate = (node: TaskNode, id: string, updates: Partial<TaskNode>): TaskNode => {
        if (node.id === id) {
            return { ...node, ...updates };
        }

        return {
            ...node,
            children: node.children.map((child) => findAndUpdate(child, id, updates)),
        };
    };

    const startEdit = (node: TaskNode) => {
        if (editingId || editForm) return;

        setEditingId(node.id);
        // <input type="date">はYYYY-MM-DD形式以外無効のためsv-SEを指定
        setEditForm({
            id: node.id,
            name: node.name,
            status: node.status,
            plannedEffort: node.plannedEffort.toString(),
            buffer: node.buffer.toString(),
            actualEffort: node.actualEffort.toString(),
            assignee: node.assignee || "",
            plannedStartDate: node.plannedStartDate ? dateToString(node.plannedStartDate, "sv-SE") : "",
            plannedEndDate: node.plannedEndDate ? dateToString(node.plannedEndDate, "sv-SE") : "",
            actualStartDate: node.actualStartDate ? dateToString(node.actualStartDate, "sv-SE") : "",
            actualEndDate: node.actualEndDate ? dateToString(node.actualEndDate, "sv-SE") : "",
            notes: node.notes || "",
        });
    };

    const saveEdit = () => {
        if (!editingId || !editForm) return;

        const updates: Partial<TaskNode> = {
            name: editForm.name,
            status: statusSchema.safeParse(editForm.status).data || undefined,
            plannedEffort: Number(editForm.plannedEffort),
            buffer: Number(editForm.buffer),
            actualEffort: Number(editForm.actualEffort),
            assignee: editForm.assignee || undefined,
            plannedStartDate: editForm.plannedStartDate ? new Date(editForm.plannedStartDate) : undefined,
            plannedEndDate: editForm.plannedEndDate ? new Date(editForm.plannedEndDate) : undefined,
            actualStartDate: editForm.actualStartDate ? new Date(editForm.actualStartDate) : undefined,
            actualEndDate: editForm.actualEndDate ? new Date(editForm.actualEndDate) : undefined,
            notes: editForm.notes || undefined,
        };

        if (ccpmMode && editingId === wbs.id) {
            updates.plannedEffort = 0;
        }

        const newWbs = findAndUpdate(wbs, editingId, updates);
        const parsed = taskNodeSchema.safeParse(newWbs);

        if (parsed.success) {
            setWbs(parsed.data);
            setEditingId(null);
            setEditForm(null);
            setIsAdding(false);
        } else {
            alert(parsed.error.issues[0].message || "保存エラー");
        }
    };

    const findNode = (node: TaskNode, id: string): TaskNode | null => {
        if (node.id === id) return node;

        for (const child of node.children) {
            const found = findNode(child, id);

            if (found) {
                return found;
            }
        }

        return null;
    };

    const addChild = (parentId: string | null) => {
        if (editingId || editForm) return;

        const newNode: TaskNode = createNode();

        if (parentId) {
            setWbs((prev) => findAndUpdate(prev, parentId, {
                children: [...(findNode(prev, parentId)?.children || []), newNode],
            }));

            if (!expanded.has(parentId)) {
                toggleExpand(parentId);
            }

            setIsAdding(true);
            startEdit(newNode);
        } else {
            setWbs((prev) => ({ ...prev, children: [...prev.children, newNode] }));
        }
    };

    const updateNode = (id: string, updates: Partial<TaskNode>) => {
        const newWbs = findAndUpdate(wbs, id, updates);
        const parsed = taskNodeSchema.safeParse(newWbs);

        if (parsed.success) {
            setWbs(parsed.data);
        }
    };

    const deleteNode = (id: string, isForced: boolean = false) => {
        if (!isForced) {
            if (editingId || editForm) return;
            if (!confirm("削除しますか?")) return;
        }

        const remove = (nodes: TaskNode[]): TaskNode[] => {
            return nodes
                .filter((n) => n.id !== id)
                .map((n) => ({ ...n, children: remove(n.children) }));
        };

        setWbs((prev) => ({ ...prev, children: remove(prev.children) }));
    };

    const updateForm = (updates: Partial<EditingRow>) => {
        setEditForm((prev) => prev ? { ...prev, ...updates } : null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);

        if (isAdding && editingId) {
            deleteNode(editingId, true);
            setIsAdding(false);
        }
    };

    const moveNode = (sourceId: string, targetId: string, position: "upper" | "middle" | "lower") => {
        if (sourceId === targetId) return;
        const sourceNode = findNode(wbs, sourceId);
        if (!sourceNode) return;

        if (position === "middle" || targetId === wbs.id) {
            deleteNode(sourceId, true);
            setWbs((prev) => findAndUpdate(prev, targetId, {
                children: [...(findNode(prev, targetId)?.children || []), sourceNode],
            }));

            if (!expanded.has(targetId)) {
                toggleExpand(targetId);
            }
        } else {
            const parentNode = findParentNode(wbs, targetId);
            if (!parentNode) return;

            deleteNode(sourceId, true);
            setWbs((prev) => findAndUpdate(prev, parentNode.id, {
                children: [
                    ...insertChild(
                        findNode(prev, parentNode.id)?.children || [],
                        sourceNode,
                        targetId,
                        position === "upper",
                    ),
                ],
            }));
        }
    };

    const findParentNode = (node: TaskNode, childId: string): TaskNode | null => {
        if (node.children.some((child) => child.id === childId)) {
            return node;
        }

        for (const child of node.children) {
            const found = findParentNode(child, childId);

            if (found) {
                return found;
            }
        }

        return null;
    };

    const insertChild = (
        children: TaskNode[],
        sourceNode: TaskNode,
        targetId: string,
        before: boolean = false,
    ) => {
        const filteredChildren = children.filter((child) => child.id !== sourceNode.id);
        const targetIndex = filteredChildren.findIndex((child) => child.id === targetId);

        if (targetIndex < 0) {
            return [...children, sourceNode];
        }

        const sliceIndex = before ? targetIndex : targetIndex + 1;

        return [
            ...filteredChildren.slice(0, sliceIndex),
            sourceNode,
            ...filteredChildren.slice(sliceIndex),
        ];
    };

    return {
        wbs,
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
        openNote: setNoteNode,
        closeNote: () => setNoteNode(null),
        moveNode,
        updateNode,
        findNode,
    };
};