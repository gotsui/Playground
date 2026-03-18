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
