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

let pool: Pool;
let isReconnecting = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 segundos

// Función mejorada para crear el pool de conexiones
const createPool = () => {
  console.log("[Database] Creando nuevo pool de conexiones...");
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    maxUses: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  });
};

// Función de reconexión mejorada
const handleReconnection = async (retryCount = 0) => {
  if (isReconnecting) return;
  isReconnecting = true;

  try {
    console.log(`[Database] Intento de reconexión ${retryCount + 1}/${MAX_RETRIES}`);
    const newPool = createPool();

    // Verificar que el nuevo pool funciona
    await newPool.query('SELECT 1');

    const oldPool = pool;
    pool = newPool;

    // Cerrar el pool antiguo de manera segura
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

    if (retryCount < MAX_RETRIES) {
      console.log(`[Database] Reintentando en ${RETRY_DELAY/1000} segundos...`);
      reconnectTimeout = setTimeout(() => handleReconnection(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('[Database] Se alcanzó el máximo número de reintentos');
      throw new Error('No se pudo restablecer la conexión a la base de datos');
    }
  }
};

// Inicializar el pool
pool = createPool();

// Manejar errores del pool
pool.on('error', (err) => {
  console.error('[Database] Error en el pool:', err);
  if (!isReconnecting && !reconnectTimeout) {
    reconnectTimeout = setTimeout(() => handleReconnection(), 1000);
  }
});

// Función para verificar el estado de la conexión
export const checkDatabaseConnection = async () => {
  try {
    const result = await pool.query('SELECT 1');
    return result.rows[0] ? true : false;
  } catch (error) {
    console.error('[Database] Error al verificar conexión:', error);
    await handleReconnection();
    return false;
  }
};

// Verificar conexión inicial
checkDatabaseConnection().catch(console.error);

// Exportar instancia de Drizzle con el pool
export const db = drizzle(pool, { schema });
export { pool };