import { apiService } from "../services/apiService";

export const agentApi = {
  activateTaxpayer: async () => {
    const res = await apiService.post("/taxations.agent/activate/");
    return res;
  },
};
