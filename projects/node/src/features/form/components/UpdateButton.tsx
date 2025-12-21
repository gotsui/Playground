import { Save } from "lucide-react";
import { Field } from "../types";

type Props = {
    id: string;
    fields: Field[];
};

const UpdateButton = ({
    id,
    fields,
}: Props) => {
    const handleClick = async () => {
        const res = await fetch(`/api/form/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fields,
            }),
        });

        if (!res.ok) {
            console.error(await res.json());
            return;
        }
    };

    return (
        <button className="size-full" onClick={handleClick}>
            <Save className="size-full" />
        </button>
    );
};

export default UpdateButton;