type CheckboxProps = {
    label: string;
    checked: boolean;
    onChange: () => void;
};

const Checkbox = ({
    label,
    checked,
    onChange,
}: CheckboxProps) => {
    return (
        <label
            className="flex items-center gap-1 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
            <input
                type="checkbox"
                value=""
                className={[
                    "w-4 h-4",
                    "text-blue-600 bg-gray-100 border-gray-300 rounded-sm",
                    "focus:ring-2 focus:ring-blue-500",
                    "dark:bg-gray-700 dark:border-gray-600",
                    "dark:ring-offset-gray-800 dark:focus:ring-blue-600",
                ].join(" ")}
                checked={checked}
                onChange={onChange}
            />
            <span>{label}</span>
        </label>
    );
};

export default Checkbox;