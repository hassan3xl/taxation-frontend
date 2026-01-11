import { apiService } from "../services/apiService";

export const accountApi = {
  getUserProfile: async () => {
    const res = await apiService.get("/profile/me/");
    return res;
  },
  getTaxpayerProfile: async () => {
    const res = await apiService.get("/profile/taxpayer/");
    return res;
  },
  getAgentProfile: async () => {
    const res = await apiService.get("/profile/agent/");
    return res;
  },
};
