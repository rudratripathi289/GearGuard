import api from './api';
import { mockRequests, mockEquipment, mockUsers } from './mockData';
import { KanbanStatus } from '../types';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const requestService = {
  async getAll() {
    await delay(500);
    return { data: mockRequests };
  },

  async getById(id) {
    await delay(300);
    const request = mockRequests.find((req) => req.id === id);
    if (!request) {
      throw new Error('Request not found');
    }
    return { data: request };
  },

  async create(requestData) {
    await delay(500);
    const equipment = mockEquipment.find((eq) => eq.id === requestData.equipmentId);
    const newRequest = {
      id: String(mockRequests.length + 1),
      ...requestData,
      equipment,
      status: KanbanStatus.NEW,
      assignedTechnicianId: null,
      assignedTechnician: null,
      attachments: requestData.attachments || [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRequests.push(newRequest);
    return { data: newRequest };
  },

  async update(id, requestData) {
    await delay(500);
    const index = mockRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Request not found');
    }
    const existingRequest = mockRequests[index];
    const updatedRequest = {
      ...existingRequest,
      ...requestData,
      updatedAt: new Date().toISOString(),
    };
    
    if (requestData.assignedTechnicianId && requestData.assignedTechnicianId !== existingRequest.assignedTechnicianId) {
      updatedRequest.assignedTechnician = mockUsers.find((u) => u.id === requestData.assignedTechnicianId);
    }
    
    mockRequests[index] = updatedRequest;
    return { data: updatedRequest };
  },

  async updateStatus(id, status) {
    await delay(300);
    return this.update(id, { status });
  },

  async assignTechnician(id, technicianId) {
    await delay(300);
    return this.update(id, { 
      assignedTechnicianId: technicianId,
      status: KanbanStatus.ASSIGNED,
    });
  },

  async addComment(id, commentData) {
    await delay(300);
    const index = mockRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Request not found');
    }
    const newComment = {
      id: String(Date.now()),
      requestId: id,
      ...commentData,
      createdAt: new Date().toISOString(),
    };
    mockRequests[index].comments.push(newComment);
    return { data: newComment };
  },
};

