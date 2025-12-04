"use client";

import { createContext, ReactNode, useContext, useReducer } from "react";

import { TaskTree } from "./type";

type Action =
    | { type: "update"; payload: { id: string; updater: (node: TaskTree) => TaskTree } }
    | { type: "addChild"; payload: { parentId: string; child: TaskTree } }
    | { type: "delete"; payload: { id: string } };

const treeReducer = (state: TaskTree, action: Action): TaskTree => {
    switch (action.type) {
        case "update":
            if (state.value.id === action.payload.id) {
                return action.payload.updater(state);
            } else {
                return {
                    ...state,
                    children: state.children?.map((child) => treeReducer(child, action)),
                };
            }
        case "addChild":
            if (state.value.id === action.payload.parentId) {
                return {
                    ...state,
                    children: [...(state.children || []), action.payload.child],
                };
            } else {
                return {
                    ...state,
                    children: state.children?.map((child) => treeReducer(child, action)),
                };
            }
        case "delete":
            if (state.value.id === action.payload.id) {
                return null as any;
            } else {
                return {
                    ...state,
                    children: state.children?.map((child) => treeReducer(child, action)).filter(Boolean) || [],
                };
            }
        default:
            return state;
    }
};

type TaskTreeContextProps = {
    root: TaskTree;
    updateNode: (id: string, updater: (node: TaskTree) => TaskTree) => void;
    addChild: (parentId: string, newNode: TaskTree) => void;
    deleteNode: (id: string) => void;
};

const TaskTreeContext = createContext<TaskTreeContextProps | undefined>(undefined);

export const TaskTreeProvider = ({
    children,
    initialTree,
}: {
    children: ReactNode;
    initialTree: TaskTree;
}) => {
    const [root, dispatch] = useReducer(treeReducer, initialTree);

    const updateNode = (id: string, updater: (node: TaskTree) => TaskTree) => {
        dispatch({ type: "update", payload: { id, updater } });
    };

    const addChild = (parentId: string, child: TaskTree) => {
        dispatch({ type: "addChild", payload: { parentId, child } });
    };

    const deleteNode = (id: string) => {
        dispatch({ type: "delete", payload: { id } });
    };

    return (
        <TaskTreeContext value={{ root, updateNode, addChild, deleteNode }}>
            {children}
        </TaskTreeContext>
    );
};

export const useTaskTree = () => {
    const context = useContext(TaskTreeContext);
    if (!context) throw new Error("useTaskTree must be used within TaskTreeProvider");
    return context;
};
