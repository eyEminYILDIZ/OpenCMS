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
    searchValue?: string;
    relationId?: string;
}

function DropdownRemote<T extends Record<string, unknown> = Record<string, unknown>>({
    name,
    endpoint,
    searchValue,
    relationId,
}: DropdownRemoteProps<T>) {
    const { values, setFieldValue, setFieldTouched } = useFormContext();
    const [options, setOptions] = useState<PickItem[]>([]);

    useEffect(() => {
        ApiClient.post<{ data: PickItem[] }>(endpoint, { search: searchValue ?? '', relationId: relationId ?? '' })
            .then((res) => setOptions(res.data.data ?? []))
            .catch(() => setOptions([]));
    }, [endpoint, searchValue, relationId]);

    return (
        <Select
            value={String(values[name] ?? '')}
            onValueChange={(val) => {
                setFieldValue(name, val);
                console.log(name, val);
            }}
        >
            <SelectTrigger onBlur={() => setFieldTouched(name, true)}>
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
