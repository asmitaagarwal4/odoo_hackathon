const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  // Auth & User
  register: async (name, email, password, role) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return res.json();
  },
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  getProfile: async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
  getAllUsers: async (token) => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
  updateUserRole: async (userId, role, token) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },
  deleteUser: async (userId, token) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },

  // Tickets
  createTicket: async (ticketData, token) => {
    const formData = new FormData();
    for (const key in ticketData) {
      if (key === 'attachment' && ticketData[key]) {
        formData.append(key, ticketData[key]);
      } else {
        formData.append(key, ticketData[key]);
      }
    }

    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'x-auth-token': token }, // No Content-Type for FormData
      body: formData,
    });
    return res.json();
  },
  getMyTickets: async (token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/my`, {
      method: 'GET',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
  getAllTickets: async (token) => {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
  getTicketById: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'GET',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
  addComment: async (ticketId, commentText, token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ comment_text: commentText }),
    });
    return res.json();
  },
  updateTicketStatus: async (ticketId, status, token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  assignTicket: async (ticketId, assigneeId, token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ assignee_id: assigneeId }),
    });
    return res.json();
  },
  voteTicket: async (ticketId, voteType, token) => {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ vote_type: voteType }),
    });
    return res.json();
  },

  // Categories
  getAllCategories: async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
  },
  createCategory: async (name, token) => {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },
  updateCategory: async (id, name, token) => {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },
  deleteCategory: async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    });
    return res.json();
  },
};

export default api;
