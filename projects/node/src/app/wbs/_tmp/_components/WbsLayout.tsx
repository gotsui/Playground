"use client";

import TaskTreeList from "./TaskTreeList";
import { useTaskTree } from "./TaskTreeProvider";

const WbsLayout = () => {
    const { root } = useTaskTree();

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-12 gap-4">
                <p className="col-span-6">タスク</p>
                <p>主担当</p>
                <p>ステータス</p>
                <p>予定工数</p>
                <p>バッファ</p>
                <p>バッファ込み工数</p>
            </div>
            <TaskTreeList node={root} />
        </div>
    );
};

export default WbsLayout;