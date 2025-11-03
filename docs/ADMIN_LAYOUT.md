# Layout do Painel Administrativo

## Estrutura Criada

O layout administrativo foi implementado com os seguintes componentes:

### 1. **AdminLayout** (`src/components/layout/admin-layout.tsx`)
Componente principal que envolve todas as páginas administrativas. Gerencia a estrutura geral com sidebar e header.

**Props:**
- `children`: ReactNode - Conteúdo da página
- `title?`: string - Título da página exibido no header

### 2. **Sidebar** (`src/components/layout/sidebar.tsx`)
Menu lateral com:
- Logo da aplicação (We Move Admin)
- Links de navegação:
  - Dashboard (`/`)
  - Solicitações (`/requests`)
  - Frota (submenu colapsável)
    - Motoristas (`/drivers`)
    - Veículos (`/vehicles`)
  - Rotas (submenu colapsável)
    - Universidades (`/universities`)
    - Cursos (`/courses`)
    - Paradas (`/stops`)
  - Relatórios (`/reports`)
- Submenus colapsáveis com ícones chevron
- Perfil do usuário com avatar e informações
- Botão de logout
- Scroll automático quando há muitos itens
- Destacamento visual do item ativo e submenu aberto

### 3. **Header** (`src/components/layout/header.tsx`)
Cabeçalho fixo com:
- Botão do menu mobile (< 768px)
- Título da página atual
- Toggle de tema (claro/escuro)

### 4. **MobileSidebar** (`src/components/layout/mobile-sidebar.tsx`)
Menu lateral para dispositivos móveis usando Sheet do shadcn/ui.

## Componentes shadcn/ui Utilizados

- ✅ **avatar** - Perfil do usuário
- ✅ **sheet** - Menu mobile
- ✅ **separator** - Divisores visuais
- ✅ **scroll-area** - Scroll suave no menu
- ✅ **card** - Cards de estatísticas e informações

## Responsividade

- **Desktop (≥768px)**: Sidebar fixa à esquerda (256px) + conteúdo principal
- **Mobile (<768px)**: Sidebar oculta com botão hambúrguer que abre um Sheet lateral

## Como Usar

```tsx
import { AdminLayout } from "@/components/layout";

export default function MinhaPage() {
  return (
    <AdminLayout title="Minha Página">
      <div>
        {/* Seu conteúdo aqui */}
      </div>
    </AdminLayout>
  );
}
```

## Personalização do Menu

Para adicionar ou remover itens do menu, edite o array `menuItems` em `src/components/layout/sidebar.tsx`:

### Link Simples
```tsx
{
  title: "Nome do Item",
  icon: IconComponent, // Ícone do lucide-react
  href: "/rota",
}
```

### Link com Submenu
```tsx
{
  title: "Nome do Grupo",
  icon: IconComponent,
  subItems: [
    {
      title: "Subitem 1",
      icon: SubIcon1,
      href: "/rota/subitem1",
    },
    {
      title: "Subitem 2",
      icon: SubIcon2,
      href: "/rota/subitem2",
    },
  ],
}
```

### Funcionalidades dos Submenus
- **Colapsável**: Clique para abrir/fechar
- **Estado persistente**: Mantém menus abertos durante navegação
- **Indicador visual**: Chevron muda direção quando aberto
- **Destaque**: Item pai destacado quando submenu está ativo
- **Bordas visuais**: Linha lateral conectando subitems

## Ícones Disponíveis

Ícones do lucide-react usados no menu:
- `Home` - Dashboard
- `FileText` - Solicitações
- `Truck` - Frota
- `User` - Motoristas
- `Car` - Veículos
- `Route` - Rotas
- `Building2` - Universidades
- `GraduationCap` - Cursos
- `MapPinned` - Paradas
- `BarChart3` - Relatórios
- `ChevronDown` / `ChevronRight` - Expandir/Colapsar

## Personalização do Perfil

Para alterar as informações do perfil do usuário, edite a seção "User Profile" em `src/components/layout/sidebar.tsx`:

```tsx
<Avatar className="h-9 w-9">
  <AvatarImage src="URL_DA_IMAGEM" alt="Nome" />
  <AvatarFallback>IN</AvatarFallback>
</Avatar>
<div className="flex flex-1 flex-col">
  <span className="text-sm font-medium">Nome do Usuário</span>
  <span className="text-xs text-muted-foreground">email@exemplo.com</span>
</div>
```

## Estados dos Menus

### Item Normal (Inativo)
```css
text-muted-foreground hover:bg-accent hover:text-accent-foreground
```

### Item Ativo
```css
bg-primary text-primary-foreground
```

### Item com Submenu (Pai)
```css
bg-accent text-accent-foreground  /* Quando submenu está aberto ou ativo */
```

### Subitem
- Indentação com margem esquerda
- Borda lateral para conexão visual
- Tamanho de ícone reduzido (h-4 w-4)

## Rotas Configuradas

| Menu | Rota | Descrição |
|------|------|-----------|
| Dashboard | `/` | Página inicial |
| Solicitações | `/requests` | Gerenciar solicitações |
| Motoristas | `/drivers` | Cadastro de motoristas |
| Veículos | `/vehicles` | Cadastro de veículos |
| Universidades | `/universities` | Cadastro de universidades |
| Cursos | `/courses` | Cadastro de cursos |
| Paradas | `/stops` | Pontos de parada |
| Relatórios | `/reports` | Relatórios e análises |

## Próximos Passos

1. Criar as páginas para cada rota
2. Implementar autenticação e vincular dados reais do usuário
3. Adicionar permissões de acesso por tipo de usuário
4. Implementar funcionalidade de logout
5. Adicionar breadcrumbs para navegação secundária
6. Persistir estado dos menus abertos no localStorage
