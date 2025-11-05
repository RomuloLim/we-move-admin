# Componentes Comuns Reutilizáveis

Este documento descreve os componentes comuns criados para facilitar a construção de páginas de listagem com funcionalidades padronizadas.

## Componentes Disponíveis

### 1. PageHeader

Cabeçalho de página com título, descrição opcional e botão de ação.

**Props:**
- `title` (string): Título da página
- `description?` (string): Descrição opcional da página
- `action?` (object): Configuração do botão de ação
  - `label` (string): Texto do botão
  - `icon?` (ReactNode): Ícone do botão
  - `onClick` (function): Função chamada ao clicar

**Exemplo:**
```tsx
<PageHeader
    title="Veículos"
    description="Gerencie a frota de veículos"
    action={{
        label: 'Novo Veículo',
        icon: <Plus className="w-4 h-4" />,
        onClick: handleOpenCreateModal,
    }}
/>
```

---

### 2. SearchBar

Barra de busca com input de pesquisa, botão de busca e seletor de itens por página.

**Props:**
- `searchTerm` (string): Valor do campo de busca
- `onSearchChange` (function): Callback para mudanças no campo de busca
- `onSearch` (function): Callback quando a busca é executada
- `placeholder?` (string): Placeholder do input (default: "Buscar...")
- `perPage?` (number): Número de itens por página
- `onPerPageChange?` (function): Callback para mudanças no número de itens por página
- `perPageOptions?` (SelectOption[]): Opções para o seletor de itens por página

**Exemplo:**
```tsx
<SearchBar
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    onSearch={handleSearch}
    placeholder="Buscar por placa, marca ou modelo..."
    perPage={filters.per_page}
    onPerPageChange={handlePerPageChange}
/>
```

---

### 3. EmptyState

Estado vazio para quando não há dados a serem exibidos.

**Props:**
- `title` (string): Título do estado vazio
- `description?` (string): Descrição opcional
- `icon?` (ReactNode): Ícone opcional
- `action?` (object): Configuração do botão de ação
  - `label` (string): Texto do botão
  - `icon?` (ReactNode): Ícone do botão
  - `onClick` (function): Função chamada ao clicar

**Exemplo:**
```tsx
<EmptyState
    title="Nenhum veículo encontrado"
    description="Comece adicionando um novo veículo à frota"
    action={{
        label: 'Adicionar Veículo',
        icon: <Plus className="w-4 h-4 mr-2" />,
        onClick: handleOpenCreateModal,
    }}
/>
```

---

### 4. DataTable

Tabela de dados genérica com suporte a loading, erro e estado vazio. Usa **composition pattern** para máxima flexibilidade.

**Props:**
- `loading?` (boolean): Se a tabela está carregando
- `error?` (string | null): Mensagem de erro, se houver
- `emptyState?` (ReactNode): Componente a ser exibido quando não há dados
- `children` (ReactNode): Conteúdo da tabela (Header e Body)

**Sub-componentes:**
- `DataTable.Header`: Cabeçalho da tabela (envolve automaticamente em TableRow)
- `DataTable.Head`: Célula de cabeçalho (equivalente a TableHead do shadcn)
- `DataTable.Body`: Corpo da tabela
- `DataTable.Row`: Linha da tabela
- `DataTable.Cell`: Célula da tabela

**Exemplo:**
```tsx
const hasData = !loading && !error && vehicles.length > 0;
const isEmpty = !loading && !error && vehicles.length === 0;

<DataTable
    loading={loading}
    error={error}
    emptyState={isEmpty ? <EmptyState {...} /> : undefined}
>
    <DataTable.Header>
        <DataTable.Head className="w-[100px]">#</DataTable.Head>
        <DataTable.Head>Placa</DataTable.Head>
        <DataTable.Head>Marca/Modelo</DataTable.Head>
        <DataTable.Head className="text-right">Capacidade</DataTable.Head>
        <DataTable.Head className="text-right">Ações</DataTable.Head>
    </DataTable.Header>
    <DataTable.Body>
        {vehicles.map((vehicle, index) => (
            <DataTable.Row key={vehicle.id}>
                <DataTable.Cell className="font-medium">
                    {pagination?.from + index}
                </DataTable.Cell>
                <DataTable.Cell className="font-medium">
                    {vehicle.license_plate}
                </DataTable.Cell>
                <DataTable.Cell>
                    {vehicle.model}
                </DataTable.Cell>
                <DataTable.Cell className="text-right">
                    {vehicle.capacity} Passageiros
                </DataTable.Cell>
                <DataTable.Cell className="text-right">
                    <Button onClick={() => handleEdit(vehicle.id)}>
                        Editar
                    </Button>
                </DataTable.Cell>
            </DataTable.Row>
        ))}
    </DataTable.Body>
</DataTable>
```

**Vantagens do Composition Pattern:**
- ✅ Máxima flexibilidade na estrutura da tabela
- ✅ Controle total sobre cada célula e linha
- ✅ Fácil adicionar lógica condicional por linha/célula
- ✅ Melhor para TypeScript (sem necessidade de generics complexos)
- ✅ Mais idiomático do React

---

### 5. TablePagination

Controles de paginação para tabelas.

**Props:**
- `pagination` (PaginationMeta): Metadados de paginação
- `onPageChange` (function): Callback quando a página é alterada

**PaginationMeta Type:**
```tsx
type PaginationMeta = {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
};
```

**Exemplo:**
```tsx
<TablePagination
    pagination={pagination}
    onPageChange={handlePageChange}
/>
```

---

## Exemplo Completo

Veja o arquivo `VehicleList.refactored.tsx` para um exemplo completo de como usar todos os componentes juntos.

### Estrutura Típica de uma Página de Listagem:

```tsx
export default function MyListPage() {
    // Estados
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({ per_page: 10, page: 1 });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');

    // Funções de manipulação
    function handleSearch() { /* ... */ }
    function handlePageChange(page: number) { /* ... */ }
    function handlePerPageChange(perPage: number) { /* ... */ }

    // Estados derivados
    const hasData = !loading && !error && items.length > 0;
    const isEmpty = !loading && !error && items.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader {...} />
                <SearchBar {...} />
                
                <DataTable
                    loading={loading}
                    error={error}
                    emptyState={isEmpty ? <EmptyState {...} /> : undefined}
                >
                    <DataTable.Header>
                        {/* Suas colunas */}
                    </DataTable.Header>
                    <DataTable.Body>
                        {items.map((item) => (
                            <DataTable.Row key={item.id}>
                                {/* Suas células */}
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
                
                {hasData && pagination && (
                    <TablePagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
```

## Casos de Uso Avançados

### Células Condicionais

```tsx
<DataTable.Body>
    {users.map((user) => (
        <DataTable.Row key={user.id}>
            <DataTable.Cell>{user.name}</DataTable.Cell>
            <DataTable.Cell>
                {user.isActive ? (
                    <span className="text-green-600">Ativo</span>
                ) : (
                    <span className="text-red-600">Inativo</span>
                )}
            </DataTable.Cell>
        </DataTable.Row>
    ))}
</DataTable.Body>
```

### Linhas com Estilos Condicionais

```tsx
<DataTable.Body>
    {orders.map((order) => (
        <DataTable.Row 
            key={order.id}
            className={order.isPriority ? 'bg-yellow-50' : ''}
        >
            <DataTable.Cell>{order.number}</DataTable.Cell>
            <DataTable.Cell>{order.customer}</DataTable.Cell>
        </DataTable.Row>
    ))}
</DataTable.Body>
```

### Células com Múltiplos Elementos

```tsx
<DataTable.Cell>
    <div className="flex flex-col">
        <span className="font-medium">{driver.name}</span>
        <span className="text-sm text-gray-500">{driver.license}</span>
    </div>
</DataTable.Cell>
```

### Tabela sem Paginação

```tsx
<DataTable loading={loading} error={error}>
    <DataTable.Header>
        <DataTable.Head>Nome</DataTable.Head>
        <DataTable.Head>Email</DataTable.Head>
    </DataTable.Header>
    <DataTable.Body>
        {items.map((item) => (
            <DataTable.Row key={item.id}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>{item.email}</DataTable.Cell>
            </DataTable.Row>
        ))}
    </DataTable.Body>
</DataTable>
```

## Benefícios

1. **Consistência**: Todas as páginas de listagem terão a mesma aparência e comportamento
2. **Manutenibilidade**: Mudanças em um componente afetam todas as páginas que o utilizam
3. **Produtividade**: Criar novas páginas de listagem é muito mais rápido
4. **Tipagem**: TypeScript fornece suporte completo de tipos
5. **Reutilização**: Componentes podem ser usados em diferentes contextos
6. **Flexibilidade**: Composition pattern permite customização total sem prop drilling
7. **Idiomático**: Segue os padrões do React e é similar a bibliotecas como Radix UI
