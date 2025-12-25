import { Process } from "../../types"
import ApprovalProcess from "./ApprovalProcess";
import CreateProcess from "./CreateProcess";
import RequestProcess from "./RequestProcess";
import StartProcess from "./StartProcess";

type Props = {
    type: Process["type"];
};

const ProcessIcon = ({
    type,
}: Props) => {
    switch (type) {
        case "start":
            return <StartProcess />
        case "end":
            return null;
        case "create":
            return <CreateProcess />
        case "request":
            return <RequestProcess />
        case "approval":
            return <ApprovalProcess />
        default:
            return null;
    }
};

export default ProcessIcon;