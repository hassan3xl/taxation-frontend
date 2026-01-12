import { apiService } from "../services/apiService";

export const agentApi = {
  addVehicle: async (data: any) => {
    const res = await apiService.post("/taxations/agent/vehicles/", data);
    return res;
  },
};
