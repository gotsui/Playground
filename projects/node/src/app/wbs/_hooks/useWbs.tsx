"use client";

import { useState } from "react";

import { TaskNodeSchema } from "../_lib/schema";
import { EditingRow, TaskNode, TaskWithCalc } from "../_lib/types";
import { calcTotals, generateId } from "../_lib/utils";

const initialNode: TaskNode = {
    id: generateId(),
    name: "新規タスク",
    status: "新規",
    effort: 0,
    buffer: 0,
    children: [],
};

export const useWbs = () => {
    const [wbs, setWbs] = useState<TaskNode>(initialNode);
    const [ccpmMode, setCcpmMode] = useState(false);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditingRow | null>(null);
    const [noteNode, setNoteNode] = useState<TaskNode | null>(null);

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
        } else {
            return {
                ...node,
                children: node.children.map((child) => findAndUpdate(child, id, updates)),
            };
        };
    };

    const startEdit = (node: TaskNode) => {
        setEditingId(node.id);
        setEditForm({
            id: node.id,
            name: node.name,
            assignee: node.assignee || "",
            status: node.status,
            effort: node.effort.toString(),
            buffer: node.buffer.toString(),
            notes: node.notes || "",
        });
    };

    const saveEdit = () => {
        if (!editingId || !editForm) return;

        const updates: Partial<TaskNode> = {
            name: editForm.name,
            assignee: editForm.assignee || undefined,
            status: editForm.status as any,
            effort: Number(editForm.effort),
            buffer: Number(editForm.buffer),
            notes: editForm.notes || undefined,
        };

        if (ccpmMode && editingId === wbs.id) {
            updates.effort = 0;
        }

        const newWbs = findAndUpdate(wbs, editingId, updates);
        const parsed = TaskNodeSchema.safeParse(newWbs);

        if (parsed.success) {
            setWbs(parsed.data);
            setEditingId(null);
            setEditForm(null);
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
        const newNode: TaskNode = { ...initialNode };

        if (parentId) {
            setWbs((prev) => findAndUpdate(prev, parentId, {
                children: [...(findNode(prev, parentId)?.children || []), newNode],
            }));
        } else {
            setWbs((prev) => ({ ...prev, children: [...prev.children, newNode] }));
        }
    };

    const updateNode = (
        children: TaskNode[],
        targetId: string,
        updates: Partial<TaskNode>,
    ): TaskNode[] => {
        return children.map(
            (node) => node.id === targetId
                ? { ...node, ...updates }
                : { ...node, children: updateNode(node.children, targetId, updates) }
        );
    };

    const deleteNode = (id: string) => {
        if (!confirm("削除しますか?")) return;

        const remove = (nodes: TaskNode[]): TaskNode[] => {
            return nodes
                .filter((n) => n.id !== id)
                .map((n) => ({ ...n, children: remove(n.children) }));
        };

        setWbs((prev) => ({ ...prev, children: remove(prev.children) }));
    };

    const updateForm = (updates: Partial<EditingRow>) => {
        setEditForm((prev) => prev ? { ...prev, updates } : null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
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
    };
};