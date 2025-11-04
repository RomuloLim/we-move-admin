import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type SelectOption = {
    value: string | number;
    label: string;
};

type SelectProps = {
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: "sm" | "default";
};

export function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Selecione...",
    disabled = false,
    className = "",
    size = "default",
}: SelectProps) {
    return (
        <Select
            value={value?.toString()}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={className} size={size}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
