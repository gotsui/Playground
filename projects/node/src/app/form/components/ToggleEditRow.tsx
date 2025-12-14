"use client";

import DataEditRow from "./DataEditRow";

type Props = {
    label: string;
    value: boolean;
    setValue?: (value: boolean) => void;
    readOnly?: boolean;
};

const ToggleEditRow = ({
    label,
    value,
    setValue,
    readOnly = false,
}: Props) => {
    return (
        <DataEditRow lable={label}>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={value}
                    onChange={setValue ? (e) => setValue(e.target.checked) : undefined}
                    disabled={readOnly}
                />
                <div
                    className={[
                        "w-9 h-5 peer",
                        "rounded-full bg-gray-200",
                        "transition-all ease-in-out duration-500",
                        "hover:bg-gray-300",
                        "peer-focus:outline-0 peer-focus:ring-transparent",
                        "peer-checked:after:translate-x-full peer-checked:after:border-white",
                        "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
                        "after:h-4 after:w-4 after:transition-all",
                        "after:bg-white after:border-gray-300 after:border after:rounded-full",
                        "peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700",
                    ].join(" ")}
                />
            </label>
        </DataEditRow>
    );
};

export default ToggleEditRow;