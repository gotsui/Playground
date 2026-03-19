import { TaskNode, TaskWithCalc, WbsTask } from "./types";

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
 * @param wbsTasks 
 * @param parentId 
 * @param logicalParentId 
 */
export const parseWbsTasks = (
    node: TaskNode,
    wbsTasks: WbsTask[],
    parentId: string | null,
    logicalParentId: string | null,
) => {
    const { id, ...nodeWithoutId } = node;
    const physicalId = generateId();

    wbsTasks.push({
        ...nodeWithoutId,
        id: physicalId,
        parentId,
        logicalId: id,
        logicalParentId,
    });

    node.children.forEach((child) => {
        parseWbsTasks(child, wbsTasks, physicalId, id);
    });
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
    const node1List: TaskNode[] = [];
    depthFirstSearch(node1).forEach((node) => node1List.push(node));

    const node2List: TaskNode[] = [];
    depthFirstSearch(node2).forEach((node) => node2List.push(node));

    if (node1List.length !== node2List.length) {
        return true;
    }

    const checkKeySet = new Set<keyof TaskNode>([
        "id",
        "name",
        "assignee",
        "status",
        "plannedEffort",
        "buffer",
        "actualEffort",
        "notes",
    ]);

    for (let i = 0; i < node1List.length; i++) {
        for (const key of checkKeySet) {
            const node1Value = node1List[i][key];
            const node2Value = node2List[i][key];

            if (!node1Value && !node2Value) {
                continue;
            }

            if (node1Value !== node2Value) {
                return true;
            }
        }
    }

    return false;
};
