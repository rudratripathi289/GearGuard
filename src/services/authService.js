import api from './api';
import { mockUsers } from './mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password, userType = null) {
    await delay(500);
    let user = mockUsers.find((u) => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (userType === 'employee' && user.role !== 'user') {
      throw new Error('This account is not an employee account. Please select "Maintenance Team" to login.');
    }

    if (userType === 'maintenance' && user.role === 'user') {
      throw new Error('This account is an employee account. Please select "Employee" to login.');
    }

    const token = `mock-token-${user.id}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { data: { user, token } };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return { data: { success: true } };
  },

  async getCurrentUser() {
    await delay(200);
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      return null;
    }
    return JSON.parse(userStr);
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
};

