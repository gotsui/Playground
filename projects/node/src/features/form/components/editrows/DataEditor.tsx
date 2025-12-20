import {
    alignItemsSchema,
    justifyContentSchema,
    writingModeSchema,
} from "../../schemas/field";
import { Field, Rect } from "../../types";
import ColorEditRow from "./ColorEditRow";
import NumberEditRow from "./NumberEditRow";
import SelectEditRow from "./SelectEditRow";
import StringEditRow from "./StringEditRow";
import ToggleEditRow from "./ToggleEditRow";

type Props = {
    field: Field;
    updateField: (next: Partial<Field> & Required<Pick<Field, "id">>) => void;
};

const DataEditor = ({
    field,
    updateField,
}: Props) => {
    const updateRect = (rect: Partial<Rect>) => {
        updateField({
            id: field.id,
            rect: {
                ...field.rect,
                ...rect,
            },
        });
    };

    const updateData = (data: Partial<Field["data"]>) => {
        updateField({
            id: field.id,
            data: {
                ...field.data,
                ...data,
            },
        });
    };

    return (
        <div className="p-4 space-y-1">
            <StringEditRow
                label="ID"
                value={field.id}
                readOnly={true}
            />
            <StringEditRow
                label="名前"
                value={field.name}
                setValue={(value) => updateField({ id: field.id, name: value })}
            />
            <NumberEditRow
                label="X座標"
                value={field.rect.left}
                setValue={(value) => updateRect({ left: value })}
            />
            <NumberEditRow
                label="Y座標"
                value={field.rect.top}
                setValue={(value) => updateRect({ top: value })}
            />
            <NumberEditRow
                label="幅"
                value={field.rect.width}
                setValue={(value) => updateRect({  width: value })}
            />
            <NumberEditRow
                label="高さ"
                value={field.rect.height}
                setValue={(value) => updateRect({ height: value })}
            />
            <ColorEditRow
                label="文字色"
                value={field.data.color}
                setValue={(value) => updateData({ color: value })}
            />
            <StringEditRow
                label="値"
                value={field.data.value}
                setValue={(value) => updateData({ value: value })}
            />
            <SelectEditRow
                label="文字の方向"
                value={field.data.writingMode}
                setValue={(value) => updateData({ writingMode: value })}
                optionsSchema={writingModeSchema}
            />
            <NumberEditRow
                label="ﾌｫﾝﾄｻｲｽﾞ"
                value={field.data.fontSize}
                setValue={(value) => updateData({ fontSize: value })}
            />
            <ToggleEditRow
                label="無効"
                value={field.data.disabled}
                setValue={(value) => updateData({ disabled: value })}
            />
            <ToggleEditRow
                label="非表示"
                value={field.data.hidden}
                setValue={(value) => updateData({ hidden: value })}
            />
            <ColorEditRow
                label="背景色"
                value={field.data.backgroundColor}
                setValue={(value) => updateData({ backgroundColor: value })}
            />
            <ToggleEditRow
                label="枠線"
                value={field.data.borderStyle === "solid"}
                setValue={(value) => updateData({ borderStyle: value ? "solid" : "none" })}
            />
            <NumberEditRow
                label="枠線幅"
                value={field.data.borderWidth}
                setValue={(value) => updateData({ borderWidth: value })}
            />
            <ColorEditRow
                label="枠線色"
                value={field.data.borderColor}
                setValue={(value) => updateData({ borderColor: value })}
            />
            <SelectEditRow
                label="水平位置"
                value={field.data.justifyContent}
                setValue={(value) => updateData({ justifyContent: value })}
                optionsSchema={justifyContentSchema}
            />
            <SelectEditRow
                label="垂直位置"
                value={field.data.alignItems}
                setValue={(value) => updateData({ alignItems: value })}
                optionsSchema={alignItemsSchema}
            />
        </div>
    );
};

export default DataEditor;