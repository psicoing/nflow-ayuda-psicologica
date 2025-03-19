# Configuración del Panel de Administración

1. En tu panel de administración, configura el archivo `.env` con:
```env
VITE_API_URL=https://mental-chat-ai-rmportbou.replit.app
```

2. Instala las dependencias necesarias:
```bash
npm install axios @tanstack/react-query
```

3. Endpoints disponibles para administración:

```typescript
// Obtener todos los usuarios
GET /api/admin/users

// Obtener todos los chats
GET /api/admin/chats

// Activar/desactivar usuario
POST /api/admin/users/:id/activate
POST /api/admin/users/:id/deactivate

// Promover usuario
POST /api/admin/users/:id/promote
Body: { role: 'professional' }

// Revisar chat
POST /api/admin/chats/:id/review
Body: { isReviewed: true }

// Marcar chat
POST /api/admin/chats/:id/flag
Body: { flagReason: string }

// Logs de actividad administrativa
GET /api/admin/activity-logs
```

4. Importante para las peticiones:
   - Incluir `credentials: 'include'` en fetch o `withCredentials: true` en axios
   - Usar `Content-Type: 'application/json'` en los headers
   - La autenticación se maneja automáticamente con cookies

5. Ejemplo de uso:
```typescript
// Configuración de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obtener usuarios
const users = await api.get('/api/admin/users');

// Activar usuario
await api.post(`/api/admin/users/${userId}/activate`);
```

6. Verificación de conexión:
```typescript
// Prueba la conexión
const response = await fetch('${VITE_API_URL}/api/health', {
  credentials: 'include'
});
const data = await response.json();
console.log('API Status:', data);