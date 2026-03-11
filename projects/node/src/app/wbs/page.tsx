import Link from "next/link";
import { Plus } from "lucide-react";

const WbsHomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Link href={"/wbs/new"}>
                <Plus />
            </Link>
        </div>
    );
};

export default WbsHomePage;