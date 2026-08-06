"use client";

import { type KeyboardEvent, useEffect, useState } from "react";
import z from "zod";

import DataEditRow from "./DataEditRow";

const numberSchema = z.coerce.number();

type Props = {
    label: string;
    value: number;
    setValue?: (value: number) => void;
    readOnly?: boolean;
};

const NumberEditRow = ({
    label,
    value,
    setValue,
    readOnly = false,
}: Props) => {
    const [str, setStr] = useState("");
    const [isComposing, setIsComposing] = useState(false);

    useEffect(() => {
        setStr(value.toString());
    }, [value]);

    const clean = () => {
        const parsed = numberSchema.safeParse(str);

        if (parsed.success && setValue) {
            setValue(parsed.data);
        } else {
            setStr(value.toString())
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isComposing) {
            clean();
        }
    };

    const handleBlur = () => {
        clean();
    };

    return (
        <DataEditRow lable={label}>
            <input
                type="text"
                className={[
                    "w-full px-2",
                    "text-sm text-gray-900",
                    "border border-slate-300 rounded-lg",
                    "hover:border-slate-400",
                ].join(" ")}
                value={str}
                onBlur={handleBlur}
                onChange={(e) => setStr(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={handleKeyDown}
                readOnly={readOnly}
                spellCheck={false}
            />
        </DataEditRow>
    );
};

export default NumberEditRow;