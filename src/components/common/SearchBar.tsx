import { Search } from 'lucide-react';

import { Button } from '@/components/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/Input';
import { CustomSelect, type SelectOption } from '@/components/Select';

type SearchBarProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    perPage?: number;
    onPerPageChange?: (value: number) => void;
    perPageOptions?: SelectOption[];
};

const DEFAULT_PER_PAGE_OPTIONS: SelectOption[] = [
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
];

export function SearchBar({
    searchTerm,
    onSearchChange,
    onSearch,
    placeholder = 'Buscar...',
    perPage,
    onPerPageChange,
    perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
}: SearchBarProps) {
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            onSearch();
        }
    }

    return (
        <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <Input
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button onClick={onSearch} variant="secondary">
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
                {perPage !== undefined && onPerPageChange && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="per-page" className="text-sm text-foreground whitespace-nowrap">
                            Por página:
                        </label>
                        <CustomSelect
                            options={perPageOptions}
                            value={perPage}
                            onChange={(value) => onPerPageChange(Number(value))}
                            size="sm"
                            className="w-20"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}
