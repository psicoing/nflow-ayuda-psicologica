# Configuración del Cliente

1. En tu nuevo Repl, crea un archivo `.env` con:
```env
VITE_API_URL=https://tu-api-repl.repl.co
```

2. Instala las dependencias necesarias:
```bash
npm install axios @tanstack/react-query
```

3. Asegúrate de que la URL en VITE_API_URL coincida con la URL de este Repl (el backend)

4. Para probar la conexión, puedes usar el endpoint de salud:
```typescript
const response = await fetch('${VITE_API_URL}/api/health', {
  credentials: 'include'
});
const data = await response.json();
console.log('API Status:', data);
```

5. Importante: Para que la autenticación funcione:
   - Todas las peticiones deben incluir `credentials: 'include'` o `withCredentials: true`
   - El dominio del backend debe estar correctamente configurado en CORS
   - Las cookies de sesión se manejarán automáticamente

6. Si obtienes errores CORS, verifica que:
   - La URL del backend es correcta
   - El backend tiene configurado CORS para aceptar peticiones de tu dominio
   - Estás incluyendo las credenciales en las peticiones
