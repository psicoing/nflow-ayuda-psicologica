// Ejemplo de configuración para el cliente (otro Repl)
import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL del Repl de la API
  withCredentials: true, // Importante para manejar cookies de sesión
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ejemplo de funciones para interactuar con la API
export async function login(username: string, password: string) {
  try {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

export async function getChatHistory() {
  try {
    const response = await api.get('/api/chats');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
}

export async function sendMessage(message: string, history: any[]) {
  try {
    const response = await api.post('/api/chat', { message, history });
    return response.data;
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    throw error;
  }
}

// Ejemplo de uso en un componente React
import { useState } from 'react';

export function ChatComponent() {
  const [message, setMessage] = useState('');
  
  async function handleSendMessage() {
    try {
      const response = await sendMessage(message, []);
      console.log('Respuesta:', response);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje"
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}
