"use client";

type DropIndicatorProps = {
    cellSize: { width: number; height: number };
    indicatorSize: { width: number; height: number };
}

const DropIndicator = ({
    cellSize,
    indicatorSize,
}: DropIndicatorProps) => {
    return (
        <div
            className={[
                "absolute z-50 pointer-events-none opacity-50",
                "bg-violet-300",
            ].join(" ")}
            style={{
                width: cellSize.width * indicatorSize.width,
                height: cellSize.height * indicatorSize.height,
            }}
        />
    )
};

export default DropIndicator;