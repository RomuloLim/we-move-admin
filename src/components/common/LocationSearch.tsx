import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

import { geocodingService, type LocationSuggestion } from '@/services/geocoding.service';
import { Input } from '@/components/Input';

type LocationSearchProps = {
    value: string;
    onChange: (value: string) => void;
    onLocationSelect: (location: { lat: number; lon: number; name: string }) => void;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
};

export function LocationSearch({
    value,
    onChange,
    onLocationSelect,
    disabled,
    label = 'Buscar Local',
    placeholder = 'Digite o nome do local...',
}: LocationSearchProps) {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fecha as sugestões ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // find suggestions based on input value
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim().length < 3) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await geocodingService.searchLocations(value);
                setSuggestions(results);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error searching locations:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [value]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.value);
        setShowSuggestions(true);
    }

    function handleSelectSuggestion(suggestion: LocationSuggestion) {
        const locationName = formatLocationName(suggestion);
        onChange(locationName);
        onLocationSelect({
            lat: parseFloat(suggestion.lat),
            lon: parseFloat(suggestion.lon),
            name: locationName,
        });
        setShowSuggestions(false);
        setSuggestions([]);
    }

    function handleClear() {
        onChange('');
        setSuggestions([]);
        setShowSuggestions(false);
    }

    function formatLocationName(suggestion: LocationSuggestion): string {
        const parts: string[] = [];

        if (suggestion.address.road) {
            parts.push(suggestion.address.road);
        }

        if (suggestion.address.neighbourhood || suggestion.address.suburb) {
            parts.push(suggestion.address.neighbourhood || suggestion.address.suburb || '');
        }

        if (suggestion.address.city) {
            parts.push(suggestion.address.city);
        }

        return parts.filter(Boolean).join(', ') || suggestion.display_name;
    }

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <Input
                    label={label}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="pr-20"
                />
                <div className="absolute right-2 top-9 flex items-center gap-1">
                    {loading && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    )}
                    {value && !loading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={disabled}
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <MapPin className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Sugestões */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            disabled={disabled}
                        >
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate">
                                        {formatLocationName(suggestion)}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate mt-0.5">
                                        {suggestion.display_name}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Estado vazio */}
            {showSuggestions && !loading && value.trim().length >= 3 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-3 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Nenhum local encontrado</span>
                    </div>
                </div>
            )}
        </div>
    );
}
