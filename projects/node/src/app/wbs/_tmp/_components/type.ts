export type TaskStatus = "new" | "working" | "completed";

export type Task = {
    id: string;
    name: string;
    worker: string;
    status: TaskStatus;
    plannedManHours: string;
    bufferedManHours: string;
};

type Tree<T> = {
    value: T;
    children?: Tree<T>[];
};

export type TaskTree = Tree<Task>;
