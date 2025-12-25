const ApprovalProcess = () => {
    return (
        <div
            className={[
                "flex flex-col justify-center items-center size-full",
                "bg-rose-100 border-2 border-rose-300 rounded-lg shadow-sm",
                "cursor-grab active:cursor-grabbing",
                "hover:border-rose-400",
            ].join(" ")}
        >
            承認
        </div>
    );
};

export default ApprovalProcess;