import { apiService } from "../services/apiService";

export const adminApi = {
  addVehicle: async (data: any) => {
    const res = await apiService.post("/admin/vehicles/", data);
    return res;
  },
  getVehicles: async () => {
    const res = await apiService.get("/admin/vehicles/");
    return res;
  },
  getVehicle: async (vehicleId: string) => {
    const res = await apiService.get(`/admin/vehicles/${vehicleId}/`);
    return res;
  },

  approveVehicle: async (vehicleId: string) => {
    const res = await apiService.post(`/admin/vehicles/${vehicleId}/approve/`);
    return res;
  },

  deleteVehicle: async (vehicleId: string) => {
    const res = await apiService.delete(`/admin/vehicles/${vehicleId}/`);
    return res;
  },

  updateVehicle: async (plateNumber: string, data: any) => {
    const res = await apiService.put(
      `/admin/agent/vehicles/${plateNumber}/`,
      data
    );
    return res;
  },

  // users here

  getUsers: async () => {
    const res = await apiService.get("/admin/users/");
    return res;
  },

  createUser: async (data: any) => {
    const res = await apiService.post("/admin/users/", data);
    return res;
  },

  getUser: async (userId: string) => {
    const res = await apiService.get(`/admin/users/${userId}/`);
    return res;
  },

  updateUser: async (userId: string, data: any) => {
    const res = await apiService.patch(`/admin/users/${userId}/`, data);
    return res;
  },

  deleteUser: async (userId: string) => {
    const res = await apiService.delete(`/admin/users/${userId}/`);
    return res;
  },

  // finance here
  getFinanceDashboard: async () => {
    const res = await apiService.get("/admin/finance/dashboard/");
    return res;
  },
  vehiclesFinance: async () => {
    const res = await apiService.get(`/admin/vehicles/finance/`);
    return res;
  },
  // payments here
  adminPayments: async () => {
    const res = await apiService.get("/admin/payments/");
    return res;
  },
  adminPayment: async (paymentId: string) => {
    const res = await apiService.get(`/admin/payments/${paymentId}/`);
    return res;
  },
};
