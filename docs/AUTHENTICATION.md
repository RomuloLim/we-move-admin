# Sistema de Autenticação

## Visão Geral

O sistema de autenticação foi implementado usando Axios para comunicação com a API Laravel Sanctum. A autenticação é baseada em token Bearer e inclui gerenciamento de estado global, proteção de rotas e persistência no localStorage.

## Arquitetura

### Componentes Principais

1. **Axios Instance** (`src/lib/axios.ts`)
   - Configuração centralizada do Axios
   - Interceptors para adicionar token Bearer automaticamente
   - Tratamento de erros 401 (redirecionamento para login)
   - Suporte para credenciais (Sanctum)

2. **Auth Service** (`src/services/auth.service.ts`)
   - Camada de API para operações de autenticação
   - Métodos: login, logout, getCurrentUser

3. **Auth Hook** (`src/hooks/useAuth.tsx`)
   - Context Provider para estado global de autenticação
   - Hook `useAuth()` para acesso ao estado em componentes
   - Gerenciamento de token e dados do usuário
   - Persistência no localStorage

4. **Protected Route** (`src/components/auth/protected-route.tsx`)
   - Componente wrapper para rotas autenticadas
   - Redirecionamento automático para login
   - Loading state durante verificação

5. **TypeScript Types** (`src/types/auth.ts`)
   - Interfaces para User, LoginCredentials, LoginResponse
   - Type safety em toda aplicação

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Laravel Sanctum

O backend deve estar configurado para:
- Endpoint: `POST /api/v1/auth/login`
- Body: `{ email: string, password: string }`
- Response: `{ user: User, token: string, token_type: 'Bearer' }`
- CORS habilitado para a origem do frontend

## Fluxo de Autenticação

### Login

1. Usuário preenche formulário de login
2. `handleSubmit` chama `login({ email, password })`
3. **CSRF Protection**: `auth.service.ts` primeiro faz GET para `/sanctum/csrf-cookie` para inicializar proteção CSRF
4. Laravel retorna cookie `XSRF-TOKEN` com o token CSRF atual
5. `auth.service.ts` faz POST para `/api/v1/auth/login` com credenciais
6. Axios automaticamente envia o token CSRF no header `X-XSRF-TOKEN`
7. Resposta contém `user` e `token`
8. Token é armazenado em `localStorage.setItem('auth_token', token)`
9. User é armazenado em `localStorage.setItem('user', JSON.stringify(user))`
10. Estado global é atualizado via `setUser(user)`
11. React Router redireciona para a home

### Requisições Autenticadas

1. Axios interceptor adiciona automaticamente: `Authorization: Bearer {token}`
2. Se resposta for 401:
   - Token é removido do localStorage
   - User é removido do estado
   - Usuário é redirecionado para `/login`

### Logout

1. Usuário clica em "Sair" no sidebar
2. `handleLogout` chama `logout()`
3. `auth.service.ts` faz POST para `/api/v1/auth/logout` (opcional)
4. Token e user são removidos do localStorage
5. Estado global é limpo (`setUser(null)`)
6. React Router redireciona para `/login`

### Verificação de Autenticação

1. `ProtectedRoute` verifica `isAuthenticated`
2. Se não autenticado, redireciona para `/login`
3. Se autenticado, renderiza o componente filho

## Uso nos Componentes

### Login Page

```tsx
import { useAuth } from "@/hooks/useAuth"

function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      // Redirecionamento automático via Navigate
    } catch (error) {
      setError(error.message)
    }
  }
}
```

### Sidebar (Exibir Usuário)

```tsx
import { useAuth } from "@/hooks/useAuth"

function Sidebar() {
  const { user, logout } = useAuth()
  
  return (
    <div>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

### Protected Route

```tsx
import { ProtectedRoute } from "@/components/auth/protected-route"

<Route
  path="/"
  element={
    <ProtectedRoute>
      <AdminLayout title="Dashboard">
        <Home />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```

## Estrutura de Dados

### User Interface

```typescript
interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}
```

### Login Credentials

```typescript
interface LoginCredentials {
  email: string
  password: string
}
```

### Login Response

```typescript
interface LoginResponse {
  user: User
  token: string
  token_type: string
}
```

## Segurança

### Token Storage

- Token armazenado em `localStorage` (não em cookies)
- Removido automaticamente em caso de 401
- Enviado como Bearer token em todas requisições

### CSRF Protection

⚠️ **IMPORTANTE**: Laravel Sanctum requer proteção CSRF para SPAs.

**Como funciona:**

1. **Inicialização**: Antes de fazer login, o frontend faz uma requisição GET para `/sanctum/csrf-cookie`
2. **Cookie CSRF**: Laravel retorna um cookie `XSRF-TOKEN` contendo o token CSRF atual
3. **Header automático**: Axios automaticamente lê o cookie e envia o valor no header `X-XSRF-TOKEN`
4. **Validação**: Laravel valida que o token no cookie corresponde ao token no header

**Implementação no código:**

```typescript
// src/lib/axios.ts
export const getCsrfCookie = async () => {
    return api.get('/sanctum/csrf-cookie');
};

// src/services/auth.service.ts
async login(credentials: LoginCredentials) {
    // First, get CSRF cookie from Sanctum
    await getCsrfCookie();
    
    // Then, make the login request
    const response = await api.post('/api/v1/auth/login', credentials);
    return response.data;
}
```

**Configuração necessária:**

- Axios configurado com `withCredentials: true` e `withXSRFToken: true`
- Laravel CORS configurado para aceitar credenciais: `'supports_credentials' => true`
- Sanctum configurado com domínios stateful no `.env` do backend

### Error Handling

- Erros de rede exibidos ao usuário com mensagens específicas
- 401 dispara logout automático e redirecionamento
- 419 (CSRF token mismatch) deve renovar o CSRF cookie
- Outros erros mostram mensagem genérica

## Próximos Passos

- [ ] Implementar refresh token
- [ ] Adicionar "Lembrar-me" (persistência estendida)
- [ ] Implementar recuperação de senha
- [ ] Adicionar verificação de email
- [ ] Implementar proteção contra força bruta
- [ ] Adicionar logs de auditoria
- [ ] Implementar 2FA (autenticação de dois fatores)

## Troubleshooting

### Token não está sendo enviado

Verifique se:
- Token está presente no localStorage: `localStorage.getItem('auth_token')`
- Axios interceptor está configurado corretamente
- Network tab mostra header `Authorization: Bearer {token}`

### 401 em todas requisições

Possíveis causas:
- Token inválido ou expirado
- Backend não está validando token corretamente
- CORS não está configurado no backend
- Endpoint de autenticação incorreto

### Redirecionamento infinito

Verifique se:
- `isAuthenticated` está retornando valor correto
- Token existe no localStorage mas está inválido
- Protected routes não estão aninhadas incorretamente

## Referências

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/tutorial)
