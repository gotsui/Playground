const CreateProcess = () => {
    return (
        <div
            className={[
                "flex flex-col justify-center items-center size-full",
                "bg-emerald-100 border-2 border-emerald-300 rounded-lg shadow-sm",
                "cursor-grab active:cursor-grabbing",
                "hover:border-emerald-400",
            ].join(" ")}
        >
            作成
        </div>
    );
};

export default CreateProcess;