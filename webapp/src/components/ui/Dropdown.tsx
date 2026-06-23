import { useFormContext } from './Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './Select';

export interface DropdownOption {
    value: string | number | boolean;
    label: string;
}

interface DropdownProps<T extends Record<string, unknown> = Record<string, unknown>> {
    name: keyof T & string;
    options: DropdownOption[];
}

function Dropdown<T extends Record<string, unknown> = Record<string, unknown>>({
    name,
    options,
}: DropdownProps<T>) {
    const { values, setFieldValue, setFieldTouched } = useFormContext();

    return (
        <Select
            value={String(values[name] ?? '')}
            onValueChange={(val) => {
                const matched = options.find((o) => String(o.value) === val);
                setFieldValue(name, matched ? matched.value : val);
            }}
        >
            <SelectTrigger onBlur={() => setFieldTouched(name, true)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={String(option.value)} value={String(option.value)}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default Dropdown;
