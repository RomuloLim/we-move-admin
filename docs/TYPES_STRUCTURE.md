# Estrutura de Tipos (@types)

## 📁 Organização

Todos os tipos da aplicação estão centralizados na pasta `src/@types/` usando `type` declarations ao invés de `interface`.

```
src/@types/
├── index.ts          # Barrel export - ponto de entrada único
└── auth.ts           # Tipos relacionados à autenticação
```

## 🎯 Convenções

### 1. Use `type` ao invés de `interface`

✅ **Correto:**
```typescript
export type User = {
  id: number;
  name: string;
  email: string;
};
```

❌ **Evite:**
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### 2. Props de Componentes

✅ **Correto:**
```typescript
type HeaderProps = {
  title?: string;
  children: ReactNode;
}
```

❌ **Evite:**
```typescript
interface HeaderProps {
  title?: string;
  children: ReactNode;
}
```

### 3. Composição de Tipos

Use intersecção de tipos (&) para composição:

```typescript
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    hint?: string;
    error?: string;
  }
```

### 4. Import Centralizado

Sempre importe do barrel file `@/@types`:

✅ **Correto:**
```typescript
import type { User, LoginCredentials, AuthContextType } from '@/@types';
```

❌ **Evite:**
```typescript
import type { User } from '@/@types/auth';
```

## 📦 Tipos Existentes

### Autenticação (`@/@types/auth.ts`)

#### `User`
Representa um usuário autenticado no sistema.

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};
```

#### `LoginCredentials`
Credenciais necessárias para fazer login.

```typescript
type LoginCredentials = {
  email: string;
  password: string;
};
```

#### `LoginResponse`
Resposta da API após login bem-sucedido.

```typescript
type LoginResponse = {
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
};
```

#### `AuthContextType`
Tipo do contexto de autenticação React.

```typescript
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
};
```

## 🆕 Adicionando Novos Tipos

### 1. Criar arquivo na pasta `@types`

```bash
# Exemplo: tipos de veículos
touch src/@types/vehicle.ts
```

### 2. Definir os tipos usando `type`

```typescript
// src/@types/vehicle.ts
export type Vehicle = {
  id: number;
  model: string;
  plate: string;
  year: number;
  capacity: number;
};

export type VehicleFormData = {
  model: string;
  plate: string;
  year: number;
  capacity: number;
};
```

### 3. Exportar no barrel file

```typescript
// src/@types/index.ts
export type { User, LoginCredentials, LoginResponse, AuthContextType } from './auth';
export type { Vehicle, VehicleFormData } from './vehicle';
```

### 4. Usar nos componentes

```typescript
import type { Vehicle, VehicleFormData } from '@/@types';

function VehicleForm() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    capacity: 0,
  });
  // ...
}
```

## 🔍 Diferenças: `type` vs `interface`

### Vantagens de usar `type`:

1. **Mais flexível para composição**
   ```typescript
   type A = { a: string };
   type B = { b: number };
   type C = A & B; // ✅ Simples e claro
   ```

2. **Suporta tipos primitivos e uniões**
   ```typescript
   type ID = string | number;
   type Status = 'pending' | 'approved' | 'rejected';
   ```

3. **Consistência no código**
   - Todos os tipos seguem o mesmo padrão
   - Mais fácil de manter e entender

4. **Melhor para tipos utilitários**
   ```typescript
   type Partial<T> = { [P in keyof T]?: T[P] };
   type Pick<T, K extends keyof T> = { [P in K]: T[P] };
   ```

### Quando ainda usar `interface`:

- Para declarações globais que precisam ser estendidas (declaration merging)
- Bibliotecas externas que requerem interfaces
- Casos específicos onde a extensão de interface é necessária

## 📚 Referências

- [TypeScript Handbook - Types vs Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [TypeScript Deep Dive - Types](https://basarat.gitbook.io/typescript/type-system)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## ✅ Checklist de Migração

Ao converter de `interface` para `type`:

- [ ] Substituir `interface` por `type`
- [ ] Usar `=` e `{}` ao invés de apenas `{}`
- [ ] Converter `extends` para `&` quando necessário
- [ ] Atualizar imports para usar `@/@types`
- [ ] Verificar se há erros de TypeScript
- [ ] Testar a aplicação

## 🎯 Exemplos Práticos

### Props de Componente React

```typescript
// src/@types/components.ts
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

// src/components/MyButton.tsx
import type { ButtonProps } from '@/@types';

export function MyButton({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}
```

### Tipos de API Response

```typescript
// src/@types/api.ts
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

// Uso
import type { ApiResponse, PaginatedResponse, User } from '@/@types';

const response: ApiResponse<User> = await api.get('/user');
const users: PaginatedResponse<User> = await api.get('/users');
```

### Tipos de Formulário

```typescript
// src/@types/forms.ts
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Uso
import type { FormState } from '@/@types';

type LoginFormData = {
  email: string;
  password: string;
};

const [formState, setFormState] = useState<FormState<LoginFormData>>({
  email: { value: '', touched: false },
  password: { value: '', touched: false },
});
```
