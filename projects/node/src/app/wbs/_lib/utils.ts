import { TaskNode, TaskWithCalc, WbsTask } from "./types";

export const generateId = () => crypto.randomUUID();

export const calcTotals = (node: TaskNode): TaskWithCalc => {
    const calcedChildren = node.children.map(calcTotals);

    const childrenEffort = calcedChildren.reduce((acc, child) => acc + child.effort, 0);
    const childrenTotalWithBuffer = calcedChildren.reduce((acc, child) => acc + child.totalWithBuffer, 0);

    return {
        ...node,
        children: calcedChildren,
        totalEffort: node.effort + childrenEffort,
        totalWithBuffer: node.effort + node.buffer + childrenTotalWithBuffer,
    };
};

export const parseWbsTasks = (node: TaskNode, wbsTasks: WbsTask[], parentId: string | null) => {
    wbsTasks.push({ ...node, parentId });

    node.children.forEach((child) => {
        parseWbsTasks(child, wbsTasks, node.id);
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
