import Link from "next/link";

const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-3 gap-4">
                <Link
                    href="/flow"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        Wasm
                    </div>
                </Link>
                <Link
                    href="/matrix"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        行列
                    </div>
                </Link>
                <Link
                    href="/screen"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        画面作成
                    </div>
                </Link>
                <Link
                    href="/flowchart"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        フロー作成
                    </div>
                </Link>
                <Link
                    href="/pfd"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        フロー作成2
                    </div>
                </Link>
                <Link
                    href="/wbs"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        WBS
                    </div>
                </Link>
                <Link
                    href="/form"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        フォーム
                    </div>
                </Link>
                <Link
                    href="/workflow"
                    className="
                        p-4 border rounded-lg shadow-md
                        hover:bg-gray-100 overflow-hidden
                    "
                >
                    <div className="text-xl font-semibold">
                        ワークフロー
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;