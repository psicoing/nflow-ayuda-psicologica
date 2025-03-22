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

let isReconnecting = false;
let reconnectTimeout: NodeJS.Timeout | null = null;

// Configuración del pool de conexiones de Neon con reintentos
const createPool = () => {
  console.log("[Database] Creando pool de conexiones para la aplicación de salud mental...");
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // Configuración específica de Neon para mejor rendimiento
    maxUses: 10000, // Número máximo de consultas por conexión
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  });
};

// Crear pool inicial
export let pool = createPool();
console.log("[Database] Pool inicial creado para la aplicación de salud mental");

const handleReconnection = async () => {
  if (isReconnecting) return;
  isReconnecting = true;

  try {
    console.log('[Database] Iniciando reconexión...');
    const newPool = createPool();

    // Verificar que el nuevo pool funciona antes de reemplazar el antiguo
    await newPool.query('SELECT 1');

    const oldPool = pool;
    pool = newPool;

    // Cerrar el pool antiguo solo después de que el nuevo esté funcionando
    if (oldPool) {
      try {
        await oldPool.end();
      } catch (err) {
        console.error('[Database] Error al cerrar el pool antiguo:', err);
      }
    }

    console.log('[Database] Reconexión exitosa');
    isReconnecting = false;

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  } catch (error) {
    console.error('[Database] Error durante la reconexión:', error);
    isReconnecting = false;

    // Programar otro intento de reconexión
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(handleReconnection, 5000);
    }
  }
};

// Manejar desconexiones y reconectar automáticamente
pool.on('error', (err) => {
  console.error('[Database] Error en el pool:', err);
  if (!isReconnecting && !reconnectTimeout) {
    reconnectTimeout = setTimeout(handleReconnection, 1000);
  }
});

// Función para verificar la conexión
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT 1');
    console.log('[Database] Conexión verificada:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[Database] Error al verificar conexión:', error);
    handleReconnection();
    return false;
  }
}

// Verificar conexión inicial
checkDatabaseConnection().catch(console.error);

// Exportar instancia de Drizzle con el pool
export const db = drizzle(pool, { schema });
console.log("[Database] ORM Drizzle configurado para la aplicación de salud mental");