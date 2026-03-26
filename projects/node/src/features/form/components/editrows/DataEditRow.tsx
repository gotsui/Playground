type Props = {
    lable: string;
    children: React.ReactNode;
};

const DataEditRow = ({
    lable,
    children,
}: Props) => {
    return (
        <div className="flex items-center w-full">
            <p className="w-2/5 text-sm">{lable}</p>
            <div className="w-3/5">
                {children}
            </div>
        </div>
    );
};

export default DataEditRow;