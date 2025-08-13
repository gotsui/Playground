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
                        フロー
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
            </div>
        </div>
    );
};

export default Home;