// import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAdminFinanceDashboard } from "@/lib/hooks/admin.hook";
import { sub } from "date-fns";
import {
  Folder,
  LucideIcon,
  MessageCircle,
  Newspaper,
  User,
} from "lucide-react";

export default function Home() {
  const { data: dashboardStats } = useGetAdminFinanceDashboard();

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
      <Header
        title={dashboard.title}
        subtitle={dashboard.subtitle}
        stats={[
          {
            title: "vehicles",
            value: dashboard.vehicles,
            icon: <Folder className="text-slate-500" size={48} />,
          },
          {
            title: "users",
            value: dashboard.users,
            icon: <User className="text-slate-500" size={48} />,
          },
          {
            title: "agents",
            value: dashboard.agents,
            icon: <Newspaper className="text-slate-500" size={48} />,
          },
          {
            title: "messages",
            value: dashboard.count,
            icon: <MessageCircle className="text-slate-500" size={48} />,
          },
        ]}
      />
      <AnalyticsCharts />
      <div>
        <div className=""></div>
      </div>
    </>
  );
}
