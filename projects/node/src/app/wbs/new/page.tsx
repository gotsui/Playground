"use client";

import WbsLayout from "../_components/WbsLayout";
import { createNode } from "../_hooks/useWbs";

const NewWbsPage = () => {
    return (
        <WbsLayout initialTaskNode={createNode("新規タスク")} />
    );
};

export default NewWbsPage;