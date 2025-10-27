"use client";

const Handle = () => {
    return (
        <>
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-0 left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-nw-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-0 left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-n-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-0 left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-ne-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-[50%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-w-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-[50%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-e-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-[100%] left-0 translate-[-50%]",
                    "bg-yellow-500 cursor-sw-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-[100%] left-[50%] translate-[-50%]",
                    "bg-yellow-500 cursor-s-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
            <div
                className={[
                    "absolute z-50 w-3 h-3",
                    "top-[100%] left-[100%] translate-[-50%]",
                    "bg-yellow-500 cursor-se-resize",
                    "hover:bg-yellow-600",
                ].join(" ")}
            />
        </>
    )
};

export default Handle;