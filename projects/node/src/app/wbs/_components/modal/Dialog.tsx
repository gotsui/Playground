"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
    isOpen: boolean;
    close: () => void;
    children: React.ReactNode;
};

const Dialog = ({
    isOpen,
    close,
    children,
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialogElement = dialogRef.current;
        if (!dialogElement) return;

        if (isOpen) {
            dialogElement.showModal();
        } else {
            dialogElement.close();
        }
    }, [isOpen]);

    const handleClickDialog = () => {
        close();
    };

    const handleClickContent = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const handleClickClose = () => {
        close();
    };

    return (
        <>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: 背景クリックによる閉じる操作のため */}
            <dialog ref={dialogRef} className="m-auto max-w-2xl w-full h-2/3 rounded-lg overflow-auto" onClick={handleClickDialog}>
                {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: 背景クリックによる閉じる操作への伝播を防ぐため */}
                <div className="flex flex-col size-full" onClick={handleClickContent}>
                    <div className="flex justify-end p-2">
                        <button type="button" className="text-blue-700 cursor-pointer hover:text-blue-500" onClick={handleClickClose}>
                            <X />
                        </button>
                    </div>
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default Dialog;