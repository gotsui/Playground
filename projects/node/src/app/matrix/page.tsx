"use client";

import Link from "next/link";

const MatrixPage = () => {
    return (
        <div className="p-4 space-y-4">
            <div>
                <Link href="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">← 戻る</Link>
            </div>
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">行列</h1>
            <div>

            </div>
        </div>
    );
};

export default MatrixPage;