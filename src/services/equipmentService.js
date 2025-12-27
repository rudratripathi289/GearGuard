import api from './api';
import { mockEquipment } from './mockData';
import { UserRole } from '../types';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const equipmentService = {
  async getAll(user = null) {
    await delay(500);
    let equipment = [...mockEquipment];
    
    if (user && user.role === UserRole.USER) {
      equipment = equipment.filter((eq) => eq.assignedToUserId === user.id);
    }
    
    return { data: equipment };
  },

  async getById(id) {
    await delay(300);
    const equipment = mockEquipment.find((eq) => eq.id === id);
    if (!equipment) {
      throw new Error('Equipment not found');
    }
    return { data: equipment };
  },

  async create(equipmentData) {
    await delay(500);
    const newEquipment = {
      id: String(mockEquipment.length + 1),
      ...equipmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEquipment.push(newEquipment);
    return { data: newEquipment };
  },

  async update(id, equipmentData) {
    await delay(500);
    const index = mockEquipment.findIndex((eq) => eq.id === id);
    if (index === -1) {
      throw new Error('Equipment not found');
    }
    mockEquipment[index] = {
      ...mockEquipment[index],
      ...equipmentData,
      updatedAt: new Date().toISOString(),
    };
    return { data: mockEquipment[index] };
  },

  async delete(id) {
    await delay(300);
    const index = mockEquipment.findIndex((eq) => eq.id === id);
    if (index === -1) {
      throw new Error('Equipment not found');
    }
    mockEquipment.splice(index, 1);
    return { data: { id } };
  },
};

