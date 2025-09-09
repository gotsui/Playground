"use client";

import { PfdFunction } from "./types";

type Loop = {
    nodeId: string;
    currentIndex: number;
    endIndex: number;
    step: number;
};

const loops: Loop[] = [];

export const pfdFunctions: PfdFunction[] = [
    {
        id: "add",
        name: "足し算",
        args: [
            { name: "augend", type: "number", label: "足される数" },
            { name: "addend", type: "number", label: "足す数" },
        ],
        func: (args) => {
            return args.augend + args.addend;
        },
        nodeType: "process",
    },
    {
        id: "loopStart",
        name: "ループ開始",
        args: [
            { name: "nodeId", type: "NodeId", label: "ノードID" },
            { name: "startIndex", type: "number", label: "開始値" },
            { name: "endIndex", type: "number", label: "終了値" },
            { name: "step", type: "number", label: "ステップ数" },
        ],
        func: (args) => {
            const loop = loops.find((l) => l.nodeId === args.nodeId);

            if (loop) {
                return loop.currentIndex;
            } else {
                loops.push({
                    nodeId: args.nodeId,
                    currentIndex: args.startIndex,
                    endIndex: args.endIndex,
                    step: args.step,
                });
                return args.startIndex;
            }
        },
        nodeType: "loopStart",
    },
    {
        id: "loopEnd",
        name: "ループ終了",
        args: [],
        func: (_) => {
            const loop = loops.at(-1);

            if (!loop) {
                return null;
            }

            loop.currentIndex += loop.step;

            if (loop.currentIndex <= loop.endIndex) {
                return loop.nodeId;
            } else {
                loops.pop();
                return null;
            }
        },
        nodeType: "loopEnd",
    }
];

export const findFunctionById = (functionId: string) => {
    return pfdFunctions.find((func) => func.id === functionId);
};
