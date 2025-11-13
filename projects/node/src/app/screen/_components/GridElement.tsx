"use client";

import Handle from "./Handle";
import { useGridContext } from "./hooks";
import { Elm, HandleDirection } from "./types";

type GridElementProps = {
    elm: Elm;
    setSelectedElmId: (id: string) => void;
    isSelected: boolean;
    handleGridElementPointerDown: (e: React.PointerEvent<HTMLDivElement>, elm: Elm) => void;
    handleHandlePointerDown: (e: React.PointerEvent<HTMLDivElement>, elm: Elm, direction: HandleDirection) => void;
};

const GridElement = ({
    elm,
    setSelectedElmId,
    isSelected,
    handleGridElementPointerDown,
    handleHandlePointerDown,
}: GridElementProps) => {
    const { cellSize, addressToPosition } = useGridContext();
    const position = addressToPosition(elm.address);

    return (
        <div
            className={[
                "fixed bg-yellow-100 px-2 py-1 z-30",
                "hover:not-[:has(.absolute:hover)]:bg-yellow-200",
                `${isSelected ? "cursor-move border border-yellow-500" : "cursor-pointer"}`,
            ].join(" ")}
            onClick={() => setSelectedElmId(elm.id)}
            onPointerDown={isSelected ? (e) => handleGridElementPointerDown(e, elm) : undefined}
            style={{
                top: position.y,
                left: position.x,
                width: cellSize.width * elm.size.width,
                height: cellSize.height * elm.size.height,
            }}
        >
            {elm.property.label}
            {isSelected && (
                <Handle
                    elm={elm}
                    handlePointerDown={handleHandlePointerDown}
                />
            )}
        </div>
    );
};

export default GridElement;