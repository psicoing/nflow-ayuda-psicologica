import axios from 'axios';
import config from './admin-api-config.json';

// Crear instancia de axios con la configuración
const api = axios.create(config.axiosConfig);

// Ejemplos de uso de la API

// 1. Verificar estado de la API
export async function checkApiHealth() {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}

// 2. Obtener todos los chats
export async function getAllChats() {
  try {
    const response = await api.get('/api/admin/chats');
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
}

// 3. Marcar un chat para revisión
export async function flagChat(chatId: number, reason: string) {
  try {
    const response = await api.post(`/api/admin/chats/${chatId}/flag`, {
      flagReason: reason
    });
    return response.data;
  } catch (error) {
    console.error('Error flagging chat:', error);
    throw error;
  }
}

// 4. Ejemplo usando fetch
export async function getAdminLogs() {
  try {
    const response = await fetch(`${config.api.baseURL}/api/admin/activity-logs`, {
      ...config.fetchConfig
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    throw error;
  }
}
