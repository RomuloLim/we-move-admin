# Sistema de Cores do We Move Admin

## Visão Geral

O painel administrativo utiliza um sistema de cores baseado em CSS Variables que suporta tanto tema claro quanto escuro. As cores são mapeadas do design system para as variáveis do shadcn/ui.

## Paleta de Cores

### Cores da Marca (Brand)

```css
--color-brand-25: #f5faff   /* Azul muito claro */
--color-brand-50: #eff8ff   /* Azul clarinho */
--color-brand-100: #d1e9ff  /* Azul claro */
--color-brand-200: #b2ddff  
--color-brand-300: #84caff  
--color-brand-400: #53b1fd  
--color-brand-500: #2e90fa  /* Azul médio */
--color-brand-600: #1570ef  /* ⭐ Azul principal */
--color-brand-700: #175cd3  
--color-brand-800: #1849a9  
--color-brand-900: #194185  /* Azul escuro */
--color-brand-950: #102a56  /* Azul muito escuro */
```

### Cores de Feedback

#### Success (Verde)
```css
--color-success-600: #079455  /* ⭐ Verde principal */
--color-success-500: #17b26a
--color-success-700: #067647
```

#### Error (Vermelho)
```css
--color-error-600: #d92d20    /* ⭐ Vermelho principal */
--color-error-500: #f04438
--color-error-700: #b42318
```

#### Warning (Laranja/Amarelo)
```css
--color-warning-600: #dc6803  /* ⭐ Laranja principal */
--color-warning-500: #f79009
--color-warning-700: #b54708
```

### Cores Neutras (Gray)

```css
--color-gray-25: #fcfcfd    /* Quase branco */
--color-gray-50: #f9fafb    /* Fundo secundário */
--color-gray-100: #f2f4f7   
--color-gray-200: #eaecf0   /* Bordas */
--color-gray-300: #d0d5dd   
--color-gray-400: #98a2b3   
--color-gray-500: #667085   /* Texto terciário */
--color-gray-600: #475467   
--color-gray-700: #344054   /* Texto secundário */
--color-gray-800: #182230   
--color-gray-900: #101828   /* ⭐ Texto principal */
--color-gray-950: #0c111d   /* Preto suave */
```

## Mapeamento shadcn/ui

### Tema Claro (Light Mode)

```css
--background: #ffffff           /* Fundo principal */
--foreground: #101828          /* Texto principal */

--primary: #1570ef             /* ⭐ Cor primária (brand-600) */
--primary-foreground: #ffffff  /* Texto sobre primário */

--secondary: #f9fafb           /* Fundo secundário (gray-50) */
--secondary-foreground: #101828

--muted: #f9fafb               /* Elementos desativados */
--muted-foreground: #667085    /* Texto desativado (gray-500) */

--accent: #f9fafb              /* Hover/estados */
--accent-foreground: #101828

--destructive: #d92d20         /* Ações destrutivas (error-600) */
--destructive-foreground: #ffffff

--border: #eaecf0              /* Bordas (gray-200) */
--ring: #1570ef                /* Focus ring (brand-600) */
```

### Tema Escuro (Dark Mode)

```css
--background: #0c111d          /* Fundo principal escuro */
--foreground: #f9fafb          /* Texto claro */

--primary: #2e90fa             /* ⭐ Cor primária mais clara (brand-500) */
--primary-foreground: #ffffff

--secondary: #182230           /* Fundo secundário escuro (gray-800) */
--secondary-foreground: #f9fafb

--muted: #182230               
--muted-foreground: #98a2b3    /* Texto desativado (gray-400) */

--accent: #182230              
--accent-foreground: #f9fafb

--destructive: #f04438         /* Erro mais claro (error-500) */
--destructive-foreground: #ffffff

--border: #344054              /* Bordas escuras (gray-700) */
--ring: #2e90fa                /* Focus ring (brand-500) */
```

## Classes Tailwind Disponíveis

### Cores da Marca
- `text-brand-600`, `bg-brand-600`, `border-brand-600`
- Variações: `-25` até `-950`

### Cores de Feedback
- `text-success-600`, `bg-success-600` (verde)
- `text-error-600`, `bg-error-600` (vermelho)
- `text-warning-600`, `bg-warning-600` (laranja)

### Cores Semânticas (shadcn)
- `text-primary`, `bg-primary` (azul da marca)
- `text-secondary`, `bg-secondary` (fundo secundário)
- `text-muted`, `bg-muted` (elementos desativados)
- `text-muted-foreground` (texto secundário)
- `text-accent`, `bg-accent` (hover)
- `text-destructive`, `bg-destructive` (erro/deletar)
- `border` (bordas padrão)

### Opacidade
Use `/10`, `/20`, etc. para opacidade:
```tsx
bg-primary/10   /* 10% de opacidade */
bg-primary/20   /* 20% de opacidade */
```

## Exemplos de Uso

### Cards de Estatísticas
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Título</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">
      <span className="text-success-600 font-medium">+12%</span> descrição
    </p>
  </CardContent>
</Card>
```

### Ícones com Fundo
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
  <Icon className="h-5 w-5 text-primary" />
</div>
```

### Links Ativos (Sidebar)
```tsx
<Link
  className={cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5",
    isActive
      ? "bg-primary text-primary-foreground"  // Ativo
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"  // Inativo
  )}
>
```

### Bordas
```tsx
<div className="rounded-lg border p-4">  {/* Usa --border automaticamente */}
```

## Boas Práticas

1. **Use cores semânticas** quando possível:
   - ✅ `text-primary` ao invés de `text-brand-600`
   - ✅ `text-muted-foreground` ao invés de `text-gray-500`
   - ✅ `text-destructive` ao invés de `text-error-600`

2. **Para feedback visual específico**, use as cores diretas:
   - ✅ `text-success-600` para indicadores positivos (+12%)
   - ✅ `text-error-600` para alertas críticos
   - ✅ `text-warning-600` para avisos

3. **Opacidade para fundos sutis**:
   - ✅ `bg-primary/10` para fundos de ícones
   - ✅ `bg-destructive/10` para alertas sutis

4. **Nunca use valores hardcoded**:
   - ❌ `text-[#1570ef]`
   - ✅ `text-primary` ou `text-brand-600`

## Acessibilidade

As cores foram escolhidas para garantir contraste adequado:
- Textos principais: ratio mínimo de 4.5:1
- Textos grandes: ratio mínimo de 3:1
- Elementos interativos: contraste claro em todos os estados

## Alternar Tema

O tema é controlado pelo `ThemeProvider`:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

// No header ou onde preferir
<ThemeToggle />
```

O tema é salvo em `localStorage` e aplicado automaticamente.
