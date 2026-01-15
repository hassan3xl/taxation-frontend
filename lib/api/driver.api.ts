import { verify } from "crypto";
import { apiService } from "../services/apiService";

export const driverApi = {
  getPlateNumber: async (plateNumber: string) => {
    const res = await apiService.get(`/driver/claim/${plateNumber}/`);
    return res;
  },

  requestOtp: async (data: any) => {
    const res = await apiService.post(`/driver/claim/request-otp/`, data);
    return res;
  },

  verifyOTP: async (otp: any) => {
    const res = await apiService.post(`/driver/claim/verify-otp/`, otp);
    return res;
  },

  getVehicles: async () => {
    const res = await apiService.get("/driver/my-vehicles/");
    return res;
  },

  initializePayment: async (data: any) => {
    const res = await apiService.post("/driver/payments/initialize/", data);
    return res;
  },
  verifyPayment: async (data: any) => {
    const res = await apiService.post(`/driver/payments/verify/`, data);
    return res;
  },
};
