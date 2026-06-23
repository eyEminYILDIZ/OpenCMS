import { useEffect, useState } from 'react';
import { useFormContext } from './Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './Select';
import { ApiClient } from '../../api/axios_setup';

interface PickItem {
    id: string;
    name: string;
}

interface DropdownRemoteProps<T extends Record<string, unknown> = Record<string, unknown>> {
    name: keyof T & string;
    endpoint: string;
}

function DropdownRemote<T extends Record<string, unknown> = Record<string, unknown>>({
    name,
    endpoint,
}: DropdownRemoteProps<T>) {
    const { values, setFieldValue } = useFormContext();
    const [options, setOptions] = useState<PickItem[]>([]);

    useEffect(() => {
        ApiClient.get<{ data: PickItem[] }>(endpoint)
            .then((res) => setOptions(res.data.data ?? []))
            .catch(() => setOptions([]));
    }, [endpoint]);

    return (
        <Select
            value={String(values[name] ?? '')}
            onValueChange={(val) => setFieldValue(name, val)}
        >
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default DropdownRemote;
