import api from './api';
import { mockUsers } from './mockData';
import { UserRole } from '../types';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return { data: mockUsers };
  },

  async getTechnicians() {
    await delay(300);
    const technicians = mockUsers.filter((u) => u.role === UserRole.TECHNICIAN);
    return { data: technicians };
  },

  async getById(id) {
    await delay(200);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { data: user };
  },
};

