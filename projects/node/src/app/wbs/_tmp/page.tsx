import { TaskTreeProvider } from "./_components/TaskTreeProvider";
import { TaskTree } from "./_components/type";
import WbsLayout from "./_components/WbsLayout";

const WbsPage = () => {
    const initialTree: TaskTree = {
        value: {
            id: "",
            name: "",
            worker: "",
            status: "new",
            plannedManHours: "",
            bufferedManHours: "",
        },
    };

    return (
        <TaskTreeProvider initialTree={initialTree}>
            <WbsLayout />
        </TaskTreeProvider>
    );
};

export default WbsPage;