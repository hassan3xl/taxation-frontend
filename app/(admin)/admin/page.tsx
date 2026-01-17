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
  return (
    <>
      <AnalyticsCharts />
      <div></div>
    </>
  );
}
