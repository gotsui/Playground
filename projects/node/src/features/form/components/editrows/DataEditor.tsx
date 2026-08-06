import {
    alignItemsSchema,
    justifyContentSchema,
    referenceValueSchema,
    writingModeSchema,
} from "../../schemas/formElement";
import { FormElement, Rect } from "../../types";
import ColorEditRow from "./ColorEditRow";
import NumberEditRow from "./NumberEditRow";
import SelectEditRow from "./SelectEditRow";
import StringEditRow from "./StringEditRow";
import ToggleEditRow from "./ToggleEditRow";

type Props = {
    element: FormElement;
    updateElement: (next: Partial<FormElement> & Required<Pick<FormElement, "id">>) => void;
};

const DataEditor = ({
    element,
    updateElement,
}: Props) => {
    const updateRect = (rect: Partial<Rect>) => {
        updateElement({
            id: element.id,
            rect: {
                ...element.rect,
                ...rect,
            },
        });
    };

    const updateData = (data: Partial<FormElement["data"]>) => {
        updateElement({
            id: element.id,
            data: {
                ...element.data,
                ...data,
            },
        });
    };

    return (
        <div className="p-4 space-y-1">
            <StringEditRow
                label="ID"
                value={element.id}
                readOnly={true}
            />
            <StringEditRow
                label="ﾌｨｰﾙﾄﾞ名"
                value={element.name}
                setValue={(value) => updateElement({ id: element.id, name: value })}
            />
            <NumberEditRow
                label="X座標"
                value={element.rect.left}
                setValue={(value) => updateRect({ left: value })}
            />
            <NumberEditRow
                label="Y座標"
                value={element.rect.top}
                setValue={(value) => updateRect({ top: value })}
            />
            <NumberEditRow
                label="幅"
                value={element.rect.width}
                setValue={(value) => updateRect({  width: value })}
            />
            <NumberEditRow
                label="高さ"
                value={element.rect.height}
                setValue={(value) => updateRect({ height: value })}
            />
            <ColorEditRow
                label="文字色"
                value={element.data.color}
                setValue={(value) => updateData({ color: value })}
            />
            <StringEditRow
                label="値"
                value={element.data.value}
                setValue={(value) => updateData({ value: value })}
            />
            <SelectEditRow
                label="文字の方向"
                value={element.data.writingMode}
                setValue={(value) => updateData({ writingMode: value })}
                optionsSchema={writingModeSchema}
            />
            <NumberEditRow
                label="ﾌｫﾝﾄｻｲｽﾞ"
                value={element.data.fontSize}
                setValue={(value) => updateData({ fontSize: value })}
            />
            <ToggleEditRow
                label="無効"
                value={element.data.disabled}
                setValue={(value) => updateData({ disabled: value })}
            />
            <ToggleEditRow
                label="非表示"
                value={element.data.hidden}
                setValue={(value) => updateData({ hidden: value })}
            />
            <ColorEditRow
                label="背景色"
                value={element.data.backgroundColor}
                setValue={(value) => updateData({ backgroundColor: value })}
            />
            <ToggleEditRow
                label="枠線"
                value={element.data.borderStyle === "solid"}
                setValue={(value) => updateData({ borderStyle: value ? "solid" : "none" })}
            />
            <NumberEditRow
                label="枠線幅"
                value={element.data.borderWidth}
                setValue={(value) => updateData({ borderWidth: value })}
            />
            <ColorEditRow
                label="枠線色"
                value={element.data.borderColor}
                setValue={(value) => updateData({ borderColor: value })}
            />
            <SelectEditRow
                label="水平位置"
                value={element.data.justifyContent}
                setValue={(value) => updateData({ justifyContent: value })}
                optionsSchema={justifyContentSchema}
            />
            <SelectEditRow
                label="垂直位置"
                value={element.data.alignItems}
                setValue={(value) => updateData({ alignItems: value })}
                optionsSchema={alignItemsSchema}
            />
            {element.type === "input" && (
                <>
                    <ToggleEditRow
                        label="編集可能"
                        value={element.data.editable}
                        setValue={(value) => updateData({ editable: value })}
                    />
                    <SelectEditRow
                        label="値参照"
                        value={element.data.referenceValue}
                        setValue={(value) => updateData({ referenceValue: value })}
                        optionsSchema={referenceValueSchema}
                    />
                </>
            )}
        </div>
    );
};

export default DataEditor;