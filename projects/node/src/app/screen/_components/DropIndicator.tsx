"use client";

type DropIndicatorProps = {
    position: { x: number; y: number };
    cellSize: { width: number; height: number };
    indicatorSize: { width: number; height: number };
}

const DropIndicator = ({
    position,
    cellSize,
    indicatorSize,
}: DropIndicatorProps) => {
    return (
        <div
            className={[
                "fixed z-50 pointer-events-none opacity-50",
                "bg-violet-300",
            ].join(" ")}
            style={{
                top: position.y,
                left: position.x,
                width: cellSize.width * indicatorSize.width,
                height: cellSize.height * indicatorSize.height,
            }}
        />
    )
};

export default DropIndicator;