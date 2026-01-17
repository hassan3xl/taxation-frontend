import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { adminApi } from "../api/admin.api";
import { apiService } from "../services/apiService";

// users here

export const useAdminGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => adminApi.getUsers(),
  });
};

export const useAdminAddUser = () => {
  return useMutation({
    mutationFn: (data: any) => adminApi.createUser(data),
    onSuccess: () => {
      toast.success("user added successfully!");
    },
  });
};

export const useAdminDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success("user deleted successfully!");
    },
  });
};

export const useAdminUpdateUser = () => {
  return useMutation({
    mutationFn: (userId: any, data: any) => adminApi.updateUser(userId, data),
    onSuccess: () => {
      toast.success("user updated successfully!");
    },
  });
};

export const useAdminGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => adminApi.getUser(userId),
  });
};

// agents
export const useAdminGetAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => adminApi.getAgents(),
  });
};
export const useAdminGetAgent = (agentId: string) => {
  return useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => adminApi.getAgent(agentId),
  });
};

// vehicles

export const useAdminAddVehicle = () => {
  return useMutation({
    mutationFn: (data: any) => adminApi.addVehicle(data),
    onSuccess: () => {
      toast.success("vehicle added successfully!");
    },
  });
};

export const useAdminGetVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => adminApi.getVehicles(),
  });
};

export const useAdminGetVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => adminApi.getVehicle(vehicleId),
  });
};

export const useAdminApproveVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleId: string) => adminApi.approveVehicle(vehicleId),
    onSuccess: () => {
      toast.success("vehicle approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

// payment hooks here
export const useGetAdminFinanceDashboard = (period: any) => {
  return useQuery({
    queryKey: ["finance-dashboard", period],
    queryFn: (period: any) => adminApi.adminFinanceDashboard(period),
  });
};

export const useGetPotentialAgents = () => {
  return useQuery({
    queryKey: ["potential-agents"],
    queryFn: async () => {
      const data = await apiService.get("/admin/users/candidates/");
      return data;
    },
  });
};

export const usePromoteToAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      station_location?: string;
    }) => {
      const { data } = await apiService.post("/admin/users/promote/", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success("User successfully promoted to Agent");
      // Refetch the list so the promoted user disappears
      queryClient.invalidateQueries({ queryKey: ["potential-agents"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to promote user");
    },
  });
};
