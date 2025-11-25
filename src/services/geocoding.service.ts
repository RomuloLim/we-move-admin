import axios from 'axios';

export type LocationSuggestion = {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    address: {
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        state?: string;
        country?: string;
    };
};

export type GeocodeResult = {
    lat: number;
    lon: number;
    display_name: string;
};

class GeocodingService {
    private readonly nominatimUrl = 'https://nominatim.openstreetmap.org';

    /**
     * Busca sugestões de locais baseado no termo de busca
     */
    async searchLocations(query: string): Promise<LocationSuggestion[]> {
        if (!query || query.trim().length < 3) {
            return [];
        }

        try {
            const response = await axios.get<LocationSuggestion[]>(
                `${this.nominatimUrl}/search`,
                {
                    params: {
                        q: query,
                        format: 'json',
                        addressdetails: 1,
                        limit: 5,
                        countrycodes: 'br', // Limita busca ao Brasil
                    },
                    headers: {
                        'User-Agent': 'WeMove-Admin/1.0',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error searching locations:', error);
            return [];
        }
    }

    /**
     * Obtém as coordenadas de um endereço
     */
    async geocode(address: string): Promise<GeocodeResult | null> {
        if (!address || address.trim().length < 3) {
            return null;
        }

        try {
            const response = await axios.get<LocationSuggestion[]>(
                `${this.nominatimUrl}/search`,
                {
                    params: {
                        q: address,
                        format: 'json',
                        limit: 1,
                        countrycodes: 'br',
                    },
                    headers: {
                        'User-Agent': 'WeMove-Admin/1.0',
                    },
                }
            );

            if (response.data.length > 0) {
                const result = response.data[0];
                return {
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    display_name: result.display_name,
                };
            }

            return null;
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    /**
     * Obtém o endereço de coordenadas (reverse geocoding)
     */
    async reverseGeocode(lat: number, lon: number): Promise<string | null> {
        try {
            const response = await axios.get<LocationSuggestion>(
                `${this.nominatimUrl}/reverse`,
                {
                    params: {
                        lat,
                        lon,
                        format: 'json',
                        addressdetails: 1,
                    },
                    headers: {
                        'User-Agent': 'WeMove-Admin/1.0',
                    },
                }
            );

            return response.data.display_name;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    }
}

export const geocodingService = new GeocodingService();
