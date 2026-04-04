import type { TaskNode, TaskWithCalc, WbsTask } from "./types";

export const generateId = () => crypto.randomUUID();

export const calcTotals = (node: TaskNode): TaskWithCalc => {
    const calcedChildren = node.children.map(calcTotals);

    const childrenEffort = calcedChildren.reduce((acc, child) => acc + child.plannedEffort, 0);
    const childrenTotalWithBuffer = calcedChildren.reduce((acc, child) => acc + child.totalWithBuffer, 0);

    return {
        ...node,
        children: calcedChildren,
        totalEffort: node.plannedEffort + childrenEffort,
        totalWithBuffer: node.plannedEffort + node.buffer + childrenTotalWithBuffer,
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
        { ...task, children: [] },
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

export function* depthFirstSearch(node: TaskNode): Generator<TaskNode> {
    yield node;

    for (const child of node.children) {
        yield* depthFirstSearch(child);
    }
}

export const hasDifference = (node1: TaskNode, node2: TaskNode) => {
    const node1List = [...depthFirstSearch(node1)];
    const node2List = [...depthFirstSearch(node2)];

    if (node1List.length !== node2List.length) {
        return true;
    }

    const checkKeySet = new Set<keyof TaskNode>([
        "id",
        "name",
        "status",
        "plannedEffort",
        "buffer",
        "actualEffort",
        "assignee",
        "startDate",
        "endDate",
        "notes",
    ]);

    for (let i = 0; i < node1List.length; i++) {
        for (const key of checkKeySet) {
            const node1Value = node1List[i][key];
            const node2Value = node2List[i][key];

            if (!node1Value && !node2Value) {
                continue;
            }

            if (node1Value instanceof Date && node2Value instanceof Date) {
                if (node1Value.getTime() === node1Value.getTime()) {
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
