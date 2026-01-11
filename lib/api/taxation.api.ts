import { apiService } from "../services/apiService";

export const taxationApi = {
  getPlateNumber: async (plateNumber: string) => {
    const res = await apiService.get(`/taxations/claim/${plateNumber}/`);
    return res;
  },

  requestOtp: async (data: any) => {
    const res = await apiService.post(`/taxations/claim/request-otp/`, data);
    return res;
  },

  verifyOTP: async (otp: any) => {
    const res = await apiService.post(`/taxations/claim/verify-otp/`, otp);
    return res;
  },

  getVehicles: async () => {
    const res = await apiService.get("/taxations/my-vehicles/");
    return res;
  },
};
