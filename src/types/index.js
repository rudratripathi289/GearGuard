export const UserRole = {
  ADMIN: 'admin',
  TECHNICIAN: 'technician',
  USER: 'user',
};

export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const KanbanStatus = {
  NEW: 'new',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in-progress',
  UNDER_REVIEW: 'under-review',
  COMPLETED: 'completed',
};

export const EquipmentStatus = {
  ACTIVE: 'active',
  UNDER_MAINTENANCE: 'under-maintenance',
  INACTIVE: 'inactive',
};

export const User = {
  id: '',
  name: '',
  email: '',
  role: UserRole.USER,
};

export const Equipment = {
  id: '',
  name: '',
  category: '',
  location: '',
  status: EquipmentStatus.ACTIVE,
  description: '',
  createdAt: '',
  updatedAt: '',
};

export const MaintenanceRequest = {
  id: '',
  equipmentId: '',
  equipment: null,
  issueDescription: '',
  priority: Priority.MEDIUM,
  status: KanbanStatus.NEW,
  assignedTechnicianId: null,
  assignedTechnician: null,
  requestDate: '',
  attachments: [],
  comments: [],
  createdAt: '',
  updatedAt: '',
};

export const Comment = {
  id: '',
  requestId: '',
  userId: '',
  userName: '',
  content: '',
  createdAt: '',
};

