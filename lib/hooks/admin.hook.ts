import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { adminApi } from "../api/admin.api";

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

// export const useAdminAddAgent = () => {
//   return useMutation({
//     mutationFn: (data: any) => adminApi.addAgent(data),
//     onSuccess: () => {
//       toast.success("agent added successfully!");
//     },
//   });
// };

// export const useAdminGetTaxpayers = () => {
//   return useQuery({
//     queryKey: ["taxpayers"],
//     queryFn: () => adminApi.getTaxpayers(),
//   });
// };

// export const useAdminGetAgents = () => {
//   return useQuery({
//     queryKey: ["agents"],
//     queryFn: () => adminApi.getAgents(),
//   });
// };
