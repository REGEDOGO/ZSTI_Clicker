const API_URL = 'http://localhost:3000/api';

export const apiClient = {
  async updateUsername(userId: number, newUsername: string) {
    const res = await fetch(`${API_URL}/update-username`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newUsername })
    });
    return handleResponse(res);
  },

  async register(username: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(res);
  },

  async login(username: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  async saveGame(userId: number, saveData: any) {
    const res = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, saveData })
    });
    return handleResponse(res);
  },

  async loadGame(userId: number) {
    const res = await fetch(`${API_URL}/load/${userId}`, {
      method: 'GET'
    });
    return handleResponse(res);
  }
};

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Wystąpił błąd');
  }
  return data;
}
