const RequestProcess = () => {
    return (
        <div
            className={[
                "flex flex-col justify-center items-center size-full",
                "bg-indigo-100 border-2 border-indigo-300 rounded-lg shadow-sm",
                "cursor-grab active:cursor-grabbing",
                "hover:border-indigo-400",
            ].join(" ")}
        >
            申請
        </div>
    );
};

export default RequestProcess;