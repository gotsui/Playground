import { partition } from "@/lib/array";
import type { TaskHistoryNode, TaskNode, TaskWithCalc, WbsTask, WbsTaskHistory } from "./types";

export const generateId = () => crypto.randomUUID();

export const calcTotals = (node: TaskNode): TaskWithCalc => {
    const calcedChildren = node.children.map(calcTotals);

    const childrenTotalPlannedEffort = calcedChildren.reduce((acc, child) => {
        if (child.children.length > 0) {
            return acc + child.totalPlannedEffort;
        } else {
            return acc + child.plannedEffort;
        }
    }, 0);

    const childrenTotalBuffer = calcedChildren.reduce((acc, child) => {
        if (child.children.length > 0) {
            return acc + child.totalBuffer;
        } else {
            return acc + child.buffer;
        }
    }, 0);

    const childrenTotalActualEffort = calcedChildren.reduce((acc, child) => {
        if (child.children.length > 0) {
            return acc + child.totalActualEffort;
        } else {
            return acc + child.actualEffort;
        }
    }, 0);

    return {
        ...node,
        children: calcedChildren,
        totalPlannedEffort: node.plannedEffort + childrenTotalPlannedEffort,
        totalBuffer: node.buffer + childrenTotalBuffer,
        totalActualEffort: node.actualEffort + childrenTotalActualEffort,
    };
};

/**
 * ツリー構造から隣接リストモデルに変換
 * @param node 
 * @param parentId 
 * @param logicalParentId 
 * @returns 
 */
export const parseWbsTasks = (
    node: TaskNode,
    parentId: string | null,
    logicalParentId: string | null,
): WbsTask[] => {
    const { id, children, ...rest } = node;
    const physicalId = generateId();

    const parsedChildren = children.flatMap((child) => parseWbsTasks(child, physicalId, id));

    return [{
        ...rest,
        id: physicalId,
        parentId,
        logicalId: id,
        logicalParentId,
    }].concat(parsedChildren);
};

export const parseTaskNode = (wbsTasks: WbsTask[]): TaskNode | null => {
    const idNodeMap = new Map<string, TaskNode>(wbsTasks.map((task) => ([
        task.id,
        {
            ...task,
            id: task.logicalId,
            parentId: task.logicalParentId,
            children: [],
        },
    ])));

    let root: TaskNode | null = null;

    wbsTasks.forEach((task) => {
        if (task.parentId) {
            const currentNode = idNodeMap.get(task.id);
            const parentNode = idNodeMap.get(task.parentId);

            if (currentNode && parentNode) {
                parentNode.children.push(currentNode);
            }
        } else {
            root = idNodeMap.get(task.id) || null;
        }
    });

    return root;
};

export const parseTaskHistoryNode = (wbsTaskHistories: WbsTaskHistory[]): TaskHistoryNode | null => {
    const idNodeMap = new Map<string, TaskHistoryNode>(wbsTaskHistories.map((task) => ([
        task.id,
        {
            ...task,
            id: task.logicalId,
            parentId: task.logicalParentId,
            createdAt: new Date(task.createdAt),
            children: [],
        },
    ])));

    let root: TaskHistoryNode | null = null;

    wbsTaskHistories.forEach((task) => {
        if (task.parentId) {
            const currentNode = idNodeMap.get(task.id);
            const parentNode = idNodeMap.get(task.parentId);

            if (currentNode && parentNode) {
                parentNode.children.push(currentNode);
            }
        } else {
            root = idNodeMap.get(task.id) || null;
        }
    });

    return root;
};

export function* depthFirstSearch(node: TaskNode): Generator<TaskNode> {
    yield node;

    for (const child of node.children) {
        yield* depthFirstSearch(child);
    }
}

export function* breadthFirstSearch(node: TaskNode): Generator<TaskNode> {
    const queue: TaskNode[] = [];
    const explored = new Set<string>();
    explored.add(node.id);
    queue.push(node);

    while (queue.length > 0) {
        const dequeued = queue.shift();
        if (!dequeued) continue;

        yield dequeued;

        for (const child of dequeued.children) {
            if (!explored.has(child.id)) {
                explored.add(child.id);
                queue.push(child);
            }
        }
    }
};

const diffCheckKeySet = new Set<keyof TaskNode>([
    "id",
    "name",
    "status",
    "plannedEffort",
    "buffer",
    "actualEffort",
    "assignee",
    "plannedStartDate",
    "plannedEndDate",
    "actualStartDate",
    "actualEndDate",
    "notes",
]);

export const hasDifference = (node1: TaskNode, node2: TaskNode) => {
    const node1List = [...depthFirstSearch(node1)];
    const node2List = [...depthFirstSearch(node2)];

    if (node1List.length !== node2List.length) {
        return true;
    }

    for (let i = 0; i < node1List.length; i++) {
        for (const key of diffCheckKeySet) {
            const node1Value = node1List[i][key];
            const node2Value = node2List[i][key];

            if (!node1Value && !node2Value) {
                continue;
            }

            if (node1Value instanceof Date && node2Value instanceof Date) {
                if (node1Value.getTime() === node2Value.getTime()) {
                    continue;
                } else {
                    return true;
                }
            }

            if (node1Value !== node2Value) {
                return true;
            }
        }
    }

    return false;
};

type DiffField = {
    key: keyof TaskNode;
    before: TaskNode[keyof TaskNode];
    after: TaskNode[keyof TaskNode];
};

export const diffNodes = (node1: TaskNode, node2: TaskNode) => {
    const node1Map: Map<string, TaskNode> = new Map([...depthFirstSearch(node1)].map((node) => [node.id, node]));
    const node2Map: Map<string, TaskNode> = new Map([...depthFirstSearch(node2)].map((node) => [node.id, node]));

    const removed = Array.from(node1Map).filter(([key, _]) => !node2Map.has(key));
    const [existing, added] = partition(Array.from(node2Map), ([id, _]) => node1Map.has(id));
    const updated = existing.filter(([id, node]) => {
        const n = node1Map.get(id);
        return n && hasDifference(n, node);
    });

    const updatedFields: { path: string[]; fields: DiffField[]; }[] = []

    for (let i = 0; i < updated.length; i++) {
        const nodeId = updated[i][0];
        const fields: DiffField[] = [];

        for (const key of diffCheckKeySet) {
            const n1 = node1Map.get(nodeId);
            const n2 = node2Map.get(nodeId);

            if (!n1 || !n2) {
                continue;
            }

            const node1Value = n1[key];
            const node2Value = n2[key];

            if (!node1Value && !node2Value) {
                continue;
            }

            if (node1Value instanceof Date && node2Value instanceof Date) {
                if (node1Value.getTime() !== node2Value.getTime()) {
                    fields.push({ key, before: node1Value, after: node2Value });
                }
            } else if (node1Value !== node2Value) {
                fields.push({ key, before: node1Value, after: node2Value });
            }
        }

        if (fields.length > 0) {
            updatedFields.push({ path: calcNodePath(node2, nodeId), fields });
        }
    }

    return {
        removedNodePathList: removed.map(([key, _]) => calcNodePath(node1, key)),
        addedNodePathList: added.map(([key, _]) => calcNodePath(node2, key)),
        updatedFields,
    };
};

export const calcNodePath = (node: TaskNode, id: string) => {
    const traverse = (node: TaskNode, path: string[]): boolean => {
        path.push(node.name);

        if (node.id === id) {
            return true;
        }

        for (const child of node.children) {
            if (traverse(child, path)) {
                return true;
            }
        }

        path.pop();
        return false;
    };

    const path: string[] = [];
    traverse(node, path);
    return path;
};

export const filterNode = (
    node: TaskNode,
    predicate: (node: TaskNode) => boolean,
    ignoreChildren: boolean = false,
): TaskNode | undefined => {
    if (ignoreChildren) {
        if (!predicate(node)) {
            return undefined;
        }

        const filteredChildren = node.children
            .map((child) => filterNode(child, predicate, ignoreChildren))
            .flatMap((n) => n ? n : []);

        return { ...node, children: filteredChildren };
    } else {
        const filteredChildren = node.children
            .map((child) => filterNode(child, predicate, ignoreChildren))
            .flatMap((n) => n ? n : []);

        if (filteredChildren.length === 0 && !predicate(node)) {
            return undefined;
        }

        return { ...node, children: filteredChildren };
    }
};
