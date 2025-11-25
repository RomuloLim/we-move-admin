# Integração de Mapas

Este documento descreve a implementação da funcionalidade de mapas interativos para visualização e criação de rotas.

## Visão Geral

A funcionalidade de mapas permite:
- **Busca de locais** com autocomplete usando a API Nominatim (OpenStreetMap)
- **Visualização interativa** das paradas em um mapa
- **Preenchimento automático** de coordenadas ao selecionar um local
- **Visualização em tempo real** da nova parada antes de salvar
- **Clique no mapa** para adicionar coordenadas manualmente

## Componentes

### 1. RouteMap (`src/components/common/RouteMap.tsx`)

Componente de mapa interativo usando Leaflet e React-Leaflet.

**Funcionalidades:**
- Exibe marcadores numerados para cada parada
- Conecta as paradas com uma linha tracejada
- Mostra preview da nova parada (marcador verde)
- Ajusta automaticamente o zoom para mostrar todas as paradas
- Permite clicar no mapa para definir coordenadas

**Props:**
```typescript
type RouteMapProps = {
    stops: Stop[];                    // Paradas existentes
    tempLocation?: {                  // Local temporário (preview)
        lat: number;
        lon: number;
        name: string;
    };
    onMapClick?: (lat: number, lon: number) => void;  // Callback para cliques no mapa
    height?: string;                  // Altura customizável
};
```

**Exemplo de uso:**
```tsx
<RouteMap
    stops={stops}
    tempLocation={tempLocation}
    onMapClick={handleMapClick}
    height="600px"
/>
```

### 2. LocationSearch (`src/components/common/LocationSearch.tsx`)

Componente de busca de locais com autocomplete.

**Funcionalidades:**
- Busca em tempo real com debounce (500ms)
- Sugestões formatadas e legíveis
- Indicador de carregamento
- Botão para limpar a busca
- Sugestões contextualizadas (endereço completo)

**Props:**
```typescript
type LocationSearchProps = {
    value: string;
    onChange: (value: string) => void;
    onLocationSelect: (location: { lat: number; lon: number; name: string }) => void;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
};
```

**Exemplo de uso:**
```tsx
<LocationSearch
    value={searchQuery}
    onChange={setSearchQuery}
    onLocationSelect={handleLocationSelect}
    label="Buscar Local"
    placeholder="Digite o nome do local..."
/>
```

### 3. GeocodingService (`src/services/geocoding.service.ts`)

Serviço para integração com a API Nominatim (OpenStreetMap).

**Métodos:**

#### `searchLocations(query: string)`
Busca sugestões de locais baseado no termo de busca.

```typescript
const results = await geocodingService.searchLocations('Avenida Paulista');
// Retorna até 5 sugestões de locais no Brasil
```

#### `geocode(address: string)`
Obtém as coordenadas de um endereço.

```typescript
const result = await geocodingService.geocode('Avenida Paulista, São Paulo');
// Retorna: { lat: -23.5505, lon: -46.6333, display_name: '...' }
```

#### `reverseGeocode(lat: number, lon: number)`
Obtém o endereço de coordenadas (reverse geocoding).

```typescript
const address = await geocodingService.reverseGeocode(-23.5505, -46.6333);
// Retorna: 'Avenida Paulista, Bela Vista, São Paulo...'
```

## RouteFormModal - Layout Atualizado

O modal de formulário de rota foi redesenhado com um layout de duas colunas:

### Coluna Esquerda - Formulário
- Informações da rota (nome e descrição)
- Busca de local com autocomplete
- Campos de latitude e longitude
- Lista de paradas (reordenável)

### Coluna Direita - Mapa
- Visualização em tempo real das paradas
- Preview da nova parada (antes de salvar)
- Marcadores numerados por ordem
- Linha conectando as paradas
- Suporte a clique para definir coordenadas

### Tamanho do Modal
- **Largura:** 95vw (quase tela inteira)
- **Altura:** 95vh (ajustável)
- **Responsivo:** Em telas menores, as colunas empilham

## Fluxo de Uso

1. **Criar/Editar Rota**
   - Preencher nome e descrição
   - Salvar a rota

2. **Adicionar Parada**
   - Digitar o nome da parada no campo de busca
   - Selecionar uma sugestão (latitude/longitude preenchidas automaticamente)
   - OU digitar manualmente as coordenadas
   - OU clicar no mapa para definir o local
   - Visualizar preview no mapa (marcador verde)
   - Clicar em "Adicionar Parada"

3. **Gerenciar Paradas**
   - Visualizar todas as paradas no mapa
   - Arrastar para reordenar
   - Remover paradas indesejadas
   - Ver a linha conectando as paradas

4. **Concluir**
   - Clicar em "Concluir" quando todas as paradas estiverem adicionadas

## Configuração

### Dependências

```bash
npm install leaflet react-leaflet @types/leaflet
```

### CSS

O CSS do Leaflet é importado automaticamente no `index.css`:

```css
@import "leaflet/dist/leaflet.css";
```

### Ícones do Mapa

Os ícones do Leaflet são carregados via CDN:
- `https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png`
- `https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png`
- `https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png`

## API Nominatim

### Limites de Uso
- **Política de Uso Justo:** Máximo de 1 requisição por segundo
- **User-Agent Obrigatório:** Configurado como "WeMove-Admin/1.0"
- **Gratuito:** Sem necessidade de chave de API

### Busca Otimizada
- **Debounce:** 500ms para evitar requisições excessivas
- **Mínimo de caracteres:** 3 para iniciar a busca
- **Limite de resultados:** 5 sugestões por busca
- **País:** Busca limitada ao Brasil (countrycodes: 'br')

## Personalização

### Estilos do Mapa

Para personalizar os marcadores, edite a função `createNumberedIcon()` em `RouteMap.tsx`:

```typescript
function createNumberedIcon(number: number) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="...">
            ${number}
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
}
```

### Provedor de Tiles

Para usar um provedor de tiles diferente, modifique o `TileLayer` em `RouteMap.tsx`:

```tsx
<TileLayer
    attribution='...'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

## Limitações Conhecidas

1. **Nominatim API**
   - Sem suporte offline
   - Resultados podem variar em qualidade
   - Limitação de taxa de requisições

2. **Performance**
   - Muitas paradas (>100) podem impactar a performance
   - Recomenda-se limitar o número de paradas por rota

3. **Navegador**
   - Requer JavaScript habilitado
   - Melhor experiência em navegadores modernos

## Melhorias Futuras

- [ ] Suporte para arrastar marcadores no mapa
- [ ] Cálculo automático de distância entre paradas
- [ ] Otimização automática da ordem das paradas
- [ ] Exportar rota como GPX/KML
- [ ] Busca de rotas otimizadas (routing)
- [ ] Camadas alternativas do mapa (satélite, trânsito)
- [ ] Cache de resultados de busca
- [ ] Suporte offline com Service Workers
