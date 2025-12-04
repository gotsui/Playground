import { TaskNode, TaskWithCalc } from "./types";

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
