import axios from 'axios';

const CHAT_API_URL = 'https://mental-chat-ai-rmportbou.replit.app';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: CHAT_API_URL,
  withCredentials: true, // Importante para manejar cookies de sesión
  headers: {
    'Content-Type': 'application/json'
  }
});

// Funciones para interactuar con la API
export async function getAllUsers() {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
}

export async function getAllChats() {
  try {
    const response = await api.get('/api/admin/chats');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo chats:', error);
    throw error;
  }
}

export async function getActivityLogs() {
  try {
    const response = await api.get('/api/admin/activity-logs');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo logs:', error);
    throw error;
  }
}

export async function updateUserStatus(userId: number, action: 'activate' | 'deactivate') {
  try {
    const response = await api.post(`/api/admin/users/${userId}/${action}`);
    return response.data;
  } catch (error) {
    console.error(`Error ${action === 'activate' ? 'activando' : 'desactivando'} usuario:`, error);
    throw error;
  }
}

export async function promoteUser(userId: number, role: string) {
  try {
    const response = await api.post(`/api/admin/users/${userId}/promote`, { role });
    return response.data;
  } catch (error) {
    console.error('Error promoviendo usuario:', error);
    throw error;
  }
}

// Ejemplo de uso en un componente React
export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Cargar datos al montar el componente
    async function loadData() {
      try {
        const [usersData, chatsData, logsData] = await Promise.all([
          getAllUsers(),
          getAllChats(),
          getActivityLogs()
        ]);
        
        setUsers(usersData);
        setChats(chatsData);
        setLogs(logsData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    }

    loadData();
  }, []);

  // ... resto del componente
}
