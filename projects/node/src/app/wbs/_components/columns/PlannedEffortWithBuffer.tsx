"use client";

import type { TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    isVisible : boolean;
};

const PlannedEffortWithBuffer = ({
    node,
    isVisible,
}: Props) => {
    if (!isVisible) {
        return null;
    }

    if (node.children.length > 0) {
        return (
        <div className="flex-1 text-right font-bold text-green-600">
                {node.totalPlannedEffort + node.totalBuffer} h
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-right font-bold text-green-600">
                {node.plannedEffort + node.buffer} h
            </div>
        );
    }
};

export default PlannedEffortWithBuffer;