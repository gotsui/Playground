"use client";

import { ChangeEvent } from "react";
import z from "zod";

import DataEditRow from "./DataEditRow";

type Props<T extends z.ZodEnum> = {
    label: string;
    value: string;
    setValue?: (value: z.infer<T>) => void;
    optionsSchema: T
};

const SelectEditRow = <T extends z.ZodEnum>({
    label,
    value,
    setValue,
    optionsSchema,
}: Props<T>) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const parsed = optionsSchema.safeParse(e.target.value);

        if (parsed.success && setValue) {
            setValue(parsed.data);
        }
    };

    return (
        <DataEditRow lable={label}>
            <select
                className={[
                    "w-full px-2",
                    "text-sm text-gray-900",
                    "border border-slate-300 rounded-lg",
                    "hover:border-slate-400",
                ].join(" ")}
                value={value}
                onChange={handleChange}
            >
                {optionsSchema.options.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
        </DataEditRow>
    );
};

export default SelectEditRow;