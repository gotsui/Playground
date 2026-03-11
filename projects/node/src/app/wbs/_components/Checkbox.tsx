type CheckboxProps = {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
};

const Checkbox = ({
    id,
    label,
    checked,
    onChange,
}: CheckboxProps) => {
    return (
        <div className="flex items-center">
            <input
                id={id}
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
            <label
                htmlFor={id}
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
                {label}
            </label>
        </div>
    );
};

export default Checkbox;