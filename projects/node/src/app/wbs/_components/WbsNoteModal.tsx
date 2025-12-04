import { TaskNode } from "../_lib/types";

type Props = {
    node: TaskNode | null;
    onClose: () => void;
};

const WbsNoteModal = ({
    node,
    onClose,
}: Props) => {
    if (!node) return null;

    return (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{node.name} - 備考</h3>
                <p className="whitespace-pre-wrap text-gray-700">{node.notes ||  "（備考なし）"}</p>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WbsNoteModal;