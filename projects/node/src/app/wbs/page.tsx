"use client";

import { Plus } from "lucide-react";

import WbsHeader from "./_components/WbsHeader";
import WbsNoteModal from "./_components/WbsNoteModal";
import WbsRow from "./_components/WbsRow";
import { useWbs } from "./_hooks/useWbs";

const WbsPage = () => {
    const {
        calcedRoot,
        ccpmMode,
        toggleCcpmMode,
        expanded,
        toggleExpand,
        editingId,
        editForm,
        startEdit,
        saveEdit,
        updateForm,
        cancelEdit,
        addChild,
        deleteNode,
        noteNode,
        openNote,
        closeNote,
    } = useWbs();

    return (
        <div className="min-h-screen bg-gray-100">
            <WbsHeader
                name={calcedRoot.name}
                ccpmMode={ccpmMode}
                onToggleCcpm={toggleCcpmMode}
                totalHours={calcedRoot.totalWithBuffer}
                projectBuffer={ccpmMode ? calcedRoot.buffer : undefined}
            />
            <div className="max-w-7xl mx-auto my-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 font-bold text-sm bg-blue-50 py-4 px-8 border-b-2 border-gray-200">
                        <div className="col-span-1" />
                        <div className="col-span-3">タスク名</div>
                        <div className="col-span-1 text-center">主担当</div>
                        <div className="col-span-1 text-center">ステータス</div>
                        <div className="col-span-1 text-right">工数</div>
                        <div className="col-span-1 text-right">バッファ</div>
                        <div className="col-span-1 text-right">バッファ込み</div>
                        <div className="col-span-1 text-right">小計</div>
                        <div className="col-span-2 text-right" />
                    </div>
                    <WbsRow
                        node={calcedRoot}
                        depth={0}
                        ccpmMode={ccpmMode}
                        isRoot={true}
                        editingId={editingId}
                        editForm={editForm}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        startEdit={startEdit}
                        saveEdit={saveEdit}
                        updateForm={updateForm}
                        cancelEdit={cancelEdit}
                        addChild={addChild}
                        deleteNode={deleteNode}
                        openNote={openNote}
                    />
                    {/* <div className="p-8 text-center border-t">
                        <button
                            onClick={() => addChild(null)}
                            className={[
                                "inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600",
                                "text-white font-bold px-8 py-4 roundedl-xl hover:to-purple-700",
                                "transition-all shadow-lg",
                            ].join(" ")}
                        >
                            <Plus className="w-6 h-6" />
                            新しいタスクを追加
                        </button>
                    </div> */}
                </div>
            </div>
            <WbsNoteModal node={noteNode} onClose={closeNote} />
        </div>
    );
};

export default WbsPage;