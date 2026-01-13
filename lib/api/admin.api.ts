import { apiService } from "../services/apiService";

export const adminApi = {
  addVehicle: async (data: any) => {
    const res = await apiService.post("/taxations/agent/vehicles/", data);
    return res;
  },
  getVehicles: async () => {
    const res = await apiService.get("/admin/vehicles/");
    return res;
  },
  getVehicle: async (plateNumber: string) => {
    const res = await apiService.get(`/admin/agent/vehicles/${plateNumber}/`);
    return res;
  },

  deleteVehicle: async (plateNumber: string) => {
    const res = await apiService.delete(
      `/admin/agent/vehicles/${plateNumber}/`
    );
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
};
