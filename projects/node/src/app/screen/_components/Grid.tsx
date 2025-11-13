"use client";

import { useGridContext } from "./hooks";
import { range } from "./utils";

const Grid = () => {
    const { gridRef, getRow, getColumn } = useGridContext();

    return (
        <div ref={gridRef} className="flex flex-col aspect-16/9 border-t border-l bg-slate-100">
            {range(getRow()).map((i) => (
                <div key={i} className="flex-1 flex">
                    {range(getColumn()).map((j) => (
                        <div
                            key={j}
                            className={[
                                "flex-1 border-r border-b",
                            ].join(" ")}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;