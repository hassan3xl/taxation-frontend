// import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Folder,
  LucideIcon,
  MessageCircle,
  Newspaper,
  User,
} from "lucide-react";

export default function Home() {
  const dashboard = {
    title: "Dashboard",
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
      <div className="pb-4 px-2">
        <p className="text-xl font-semibold">Admin Dashboard</p>
        <p>
          {dashboard.admin.name} - {dashboard.admin.email}
        </p>
      </div>
      <div className="grid grid-cols-3 justify-between gap-5 mb-5">
        <DashboardCard
          title="vehicles"
          count={dashboard.vehicles}
          icon={<Newspaper className="text-slate-500" size={72} />}
        />

        <DashboardCard
          title="users"
          count={dashboard.users}
          icon={<User className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Agents"
          count={dashboard.agents}
          icon={<MessageCircle className="text-slate-500" size={72} />}
        />
      </div>
      {/* <AnalyticsCharts /> */}
    </>
  );
}

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactElement<LucideIcon>;
}

const DashboardCard = ({ title, count, icon }: DashboardCardProps) => {
  return (
    <Card className="p-4 pb-0">
      <CardContent>
        <h3 className="text-3xl text-center mb-4 font-bold">{title}</h3>
        <div className="flex gap-5 justify-center items-center">
          {icon}
          <h3 className="text-5xl font-semibold text-secondary-foreground">
            {count}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};
