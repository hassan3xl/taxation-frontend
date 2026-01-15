import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { sub } from "date-fns";
import {
  Folder,
  LucideIcon,
  MessageCircle,
  Newspaper,
  User,
} from "lucide-react";

export default function Home() {
  // console.log("dashboard stats", dashboardStats);
  const dashboard = {
    title: "Dashboard",
    subtitle: "Welcome back, Admin!",
    admin: {
      name: "Admin Fullname",
      email: "a@b.com",
    },
    count: 126,
    users: 950,
    agents: 6203,
    vehicles: 126,
  };

  return (
    <>
      <AnalyticsCharts />
      <div></div>
    </>
  );
}
