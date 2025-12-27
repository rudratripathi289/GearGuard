import { UserRole } from '../types';

export const isEmployee = (role) => role === UserRole.USER;
export const isMaintenanceTeam = (role) => role === UserRole.ADMIN || role === UserRole.TECHNICIAN;

export const canViewAllRequests = (role) => isMaintenanceTeam(role);
export const canViewAllEquipment = (role) => isMaintenanceTeam(role);
export const canChangeRequestStatus = (role) => isMaintenanceTeam(role);
export const canAssignTechnician = (role) => isMaintenanceTeam(role);
export const canEditRequest = (role) => isMaintenanceTeam(role);
export const canDeleteRequest = (role) => isMaintenanceTeam(role);
export const canAddComments = (role, request, userId) => {
  if (isMaintenanceTeam(role)) return true;
  if (isEmployee(role) && request.createdByUserId === userId) return true;
  return false;
};

export const canViewRequest = (role, request, userId) => {
  if (isMaintenanceTeam(role)) return true;
  if (isEmployee(role) && request.createdByUserId === userId) return true;
  return false;
};

export const canViewEquipment = (role, equipment, userId) => {
  if (isMaintenanceTeam(role)) return true;
  if (isEmployee(role) && equipment.assignedToUserId === userId) return true;
  return false;
};

