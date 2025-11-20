import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Stop } from '@/@types/route';

// Fix para os ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Ícone customizado para marcadores numerados
function createNumberedIcon(number: number) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="flex items-center justify-center w-8 h-8 bg-brand-600 text-white rounded-full border-2 border-white shadow-lg font-bold text-sm">
            ${number}
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
}

// Ícone para o marcador temporário (local sendo adicionado)
const tempMarkerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full border-2 border-white shadow-lg">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

type RouteMapProps = {
    stops: Stop[];
    tempLocation?: {
        lat: number;
        lon: number;
        name: string;
    };
    onMapClick?: (lat: number, lon: number) => void;
    height?: string;
};

// Componente para ajustar automaticamente o zoom e centro do mapa
function MapController({ stops, tempLocation }: { stops: Stop[]; tempLocation?: RouteMapProps['tempLocation'] }) {
    const map = useMap();

    useEffect(() => {
        const allPoints: [number, number][] = [];

        // Adiciona as paradas existentes
        stops.forEach((stop) => {
            if (stop.latitude && stop.longitude) {
                allPoints.push([parseFloat(stop.latitude), parseFloat(stop.longitude)]);
            }
        });

        // Adiciona o local temporário
        if (tempLocation) {
            allPoints.push([tempLocation.lat, tempLocation.lon]);
        }

        // Ajusta o mapa para mostrar todos os pontos
        if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [stops, tempLocation, map]);

    return null;
}

// Componente para capturar cliques no mapa
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

export function RouteMap({ stops, tempLocation, onMapClick, height = '600px' }: RouteMapProps) {
    const mapRef = useRef<L.Map | null>(null);

    // Centro padrão (São Paulo)
    const defaultCenter: [number, number] = [-23.5505, -46.6333];
    const defaultZoom = 13;

    // Prepara os pontos da rota
    const routePoints: [number, number][] = useMemo(() => stops
        .filter((stop) => stop.latitude && stop.longitude)
        .map((stop) => [parseFloat(stop.latitude!), parseFloat(stop.longitude!)]), [stops]);

    return (
        <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController stops={stops} tempLocation={tempLocation} />
                <MapClickHandler onMapClick={onMapClick} />

                {/* Marcadores das paradas */}
                {stops.map((stop, index) => {
                    if (!stop.latitude || !stop.longitude) return null;

                    const position: [number, number] = [
                        parseFloat(stop.latitude),
                        parseFloat(stop.longitude),
                    ];

                    return (
                        <Marker
                            key={stop.id}
                            position={position}
                            icon={createNumberedIcon(index + 1)}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <strong className="block font-semibold text-gray-900">
                                        {stop.stop_name}
                                    </strong>
                                    <span className="text-gray-600">Parada #{index + 1}</span>
                                    <div className="mt-1 text-xs text-gray-500">
                                        <div>Lat: {stop.latitude}</div>
                                        <div>Lon: {stop.longitude}</div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Marcador temporário */}
                {tempLocation && (
                    <Marker
                        position={[tempLocation.lat, tempLocation.lon]}
                        icon={tempMarkerIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block font-semibold text-green-600">
                                    {tempLocation.name}
                                </strong>
                                <span className="text-gray-600">Nova parada</span>
                                <div className="mt-1 text-xs text-gray-500">
                                    <div>Lat: {tempLocation.lat.toFixed(6)}</div>
                                    <div>Lon: {tempLocation.lon.toFixed(6)}</div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Linha conectando as paradas */}
                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints}
                        pathOptions={{
                            color: '#E84E0F',
                            weight: 3,
                            opacity: 0.7,
                            dashArray: '10, 10',
                        }}
                    />
                )}
            </MapContainer>

            {/* Legenda */}
            {stops.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                    <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                                1
                            </div>
                            <span className="text-gray-700">Paradas</span>
                        </div>
                        {tempLocation && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center border-2 border-white">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Nova parada</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
