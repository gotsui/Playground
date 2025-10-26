"use client";

import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel } from "@/components/sidetabs";
import { Item, Size } from "./types";
import { CellAddress } from "./useGrid";
import useDnD, { OnPointerUpAction } from "./useDnD";
import { XYPosition } from "./usePointerPosition";

const menuItems: Item[] = [
    { id: "input", label: "input", size: { width: 2, height: 1 } },
    { id: "button", label: "button", size: { width: 1, height: 1 } },
    { id: "table", label: "table", size: { width: 3, height: 3 } },
];

type LeftSidebarProps = {
    setDraggedElmSize: React.Dispatch<React.SetStateAction<Size | null>>;
    setDraggedOffset: React.Dispatch<React.SetStateAction<CellAddress | null>>;
    handleLayoutPointerUp: (action: OnPointerUpAction) => OnPointerUpAction;
    createElm: (itemId: string, size: Size) => ({ position }: { position: XYPosition }) => void;
};

const LeftSidebar = ({
    setDraggedElmSize,
    setDraggedOffset,
    handleLayoutPointerUp,
    createElm,
}: LeftSidebarProps) => {
    const { handlePointerDown } = useDnD();

    return (
        <div className="flex flex-col">
            <div className="p-2">
                <Link href="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">← 戻る</Link>
            </div>
            <div className="flex-1 flex">
                <TabGroup defaultTab="form">
                    <TabList>
                        <Tab id="form">フォーム</Tab>
                    </TabList>
                    <TabPanel id="form">
                        <div className="h-full w-32 space-y-2">
                            {menuItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        cursor-grab border-b border-gray-200 p-1
                                        hover:bg-gray-200 transition
                                        active:cursor-grabbing
                                    "
                                    onPointerDown={(e) => {
                                        setDraggedElmSize(item.size);
                                        setDraggedOffset({ row: 0, column: 0 });
                                        handlePointerDown(e, handleLayoutPointerUp(createElm(item.id, item.size)));
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                </TabGroup>
            </div>
        </div>
    );
};

export default LeftSidebar;