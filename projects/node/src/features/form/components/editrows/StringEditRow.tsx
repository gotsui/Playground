"use client";

import DataEditRow from "./DataEditRow";

type Props = {
    label: string;
    value: string;
    setValue?: (value: string) => void;
    readOnly?: boolean;
};

const StringEditRow = ({
    label,
    value,
    setValue,
    readOnly = false,
}: Props) => {
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
                value={value}
                onChange={setValue ? (e) => setValue(e.target.value) : undefined}
                readOnly={readOnly}
            />
        </DataEditRow>
    );
};

export default StringEditRow;