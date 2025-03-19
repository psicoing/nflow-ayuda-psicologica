import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL debe estar configurada. ¿Olvidaste provisionar la base de datos?",
  );
}

// Configuración del pool de conexiones de Neon con reintentos
const createPool = () => {
  console.log("[Database] Creando pool de conexiones...");
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20, // Máximo número de clientes
    idleTimeoutMillis: 30000, // Tiempo máximo de inactividad
    connectionTimeoutMillis: 2000, // Tiempo máximo para establecer conexión
  });
};

// Crear pool inicial
export let pool = createPool();
console.log("[Database] Pool inicial creado");

// Manejar desconexiones y reconectar automáticamente
pool.on('error', (err) => {
  console.error('[Database] Error en el pool:', err);
  if (err.message.includes('terminating connection due to administrator command')) {
    console.log('[Database] Reconectando después de desconexión administrativa...');
    pool.end().catch(console.error);
    pool = createPool();
  }
});

// Exportar instancia de Drizzle con el pool
export const db = drizzle(pool, { schema });
console.log("[Database] ORM Drizzle configurado");

// Función para verificar la conexión
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT 1');
    console.log('[Database] Conexión verificada:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[Database] Error al verificar conexión:', error);
    return false;
  }
}

// Verificar conexión inicial
checkDatabaseConnection().catch(console.error);