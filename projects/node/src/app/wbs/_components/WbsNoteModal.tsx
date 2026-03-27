import { useState } from "react";

import type { TaskNode } from "../_lib/types";

type Props = {
    node: TaskNode;
    updateNode: (id: string, updates: Partial<TaskNode>) => void;
    onClose: () => void;
};

const WbsNoteModal = ({
    node,
    updateNode,
    onClose,
}: Props) => {
    const [value, setValue] = useState(node.notes || "");

    const handleClick = () => {
        updateNode(node.id, { notes: value });
        onClose();
    };

    return (
        <>
            {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: 背景クリックによる閉じる操作のため */}
            <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50" onClick={handleClick}>
                {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: 背景クリックによる閉じる操作への伝播を防ぐため */}
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto focus:outline-none" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-xl font-bold mb-4">{node.name} - 備考</h3>
                    <textarea
                        className="size-full whitespace-pre-wrap text-gray-700 p-2"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="（備考なし）"
                        spellCheck={false}
                    />
                    <div className="mt-6 text-right">
                        <button type="button" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={handleClick}>
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WbsNoteModal;