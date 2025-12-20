import { memo } from "react";

import { range } from "@/lib/array";

type Props = {
    gridSize: {
        row: number;
        column: number;
    };
    cellSize: {
        width: number;
        height: number;
    };
};

const Grid = memo(({
    gridSize,
    cellSize,
}: Props) => {
    return (
        <>
            {range(gridSize.row).map((i) => (
                <div key={i} className="flex">
                    {range(gridSize.column).map((j) => (
                        <div
                            key={j}
                            className="border border-slate-300"
                            style={cellSize}
                        />
                    ))}
                </div>
            ))}
        </>
    );
});

export default Grid;