"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wallet, Activity, Users, TrendingUp } from "lucide-react";
import { useGetAdminFinanceDashboard } from "@/lib/hooks/admin.hook";
import { format } from "date-fns"; // Recommended for formatting chart dates
import { useRouter } from "next/navigation";

const AnalyticsCharts = () => {
  // 1. Manage Time Filter State
  const [period, setPeriod] = useState("30_days");

  // 2. Fetch Data (pass period to hook)
  const { data: dashboardStats, isLoading } =
    useGetAdminFinanceDashboard(period);
  console.log("dashboardStats", dashboardStats);
  // Helper to format currency
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount || 0);
  };
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Safe access to data (in case API returns null initially)
  const stats = dashboardStats?.summary || {
    total_revenue: 0,
    total_transactions: 0,
    average_value: 0,
  };
  const graphData = dashboardStats?.graph_data || [];
  const topAgents = dashboardStats?.top_agents || [];

  return (
    <div className="space-y-6">
      {/* --- 1. Header & Filters --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Overview
          </h2>
          <p className="text-muted-foreground">
            Revenue analysis and agent performance metrics.
          </p>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="30_days">Last 30 Days</SelectItem>
            <SelectItem value="3_months">Last 3 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- 2. Key Stats Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatNaira(stats.total_revenue)}
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
          sub="Selected period"
        />
        <StatsCard
          title="Transactions"
          value={stats.total_transactions}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          sub="Total payments processed"
        />
        <StatsCard
          title="Avg. Transaction"
          value={formatNaira(stats.average_value)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          sub="Revenue per vehicle"
        />
        <StatsCard
          title="Active Agents"
          value={topAgents.length}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          sub="Contributors this period"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* --- 3. Revenue Chart (Takes up 4 columns) --- */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Income generated over the selected timeframe.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      // Simple date formatting
                      const date = new Date(value);
                      return period === "year"
                        ? date.toLocaleDateString("en-US", { month: "short" })
                        : date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip
                    formatter={(value: any) => `₦${value}`}
                    labelFormatter={(label) => new Date(label).toDateString()}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981" // Emerald green color
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* --- 4. Top Performing Agents (Takes up 3 columns) --- */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>
              Highest cash collectors this period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topAgents.length > 0 ? (
                topAgents.map((agent: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => router.push(`/admin/agents/${agent.id}`)}
                    className="flex hover:bg-accent hover:p-2 rounded-md cursor-pointer items-center"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-800">
                      {index + 1}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {agent.collected_by || "Unknown Agent"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {agent.transaction_count} transactions
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-emerald-600">
                      +{formatNaira(agent.total_collected)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No agent activity found for this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple reusable Stats Card component
function StatsCard({
  title,
  value,
  icon,
  sub,
}: {
  title: string;
  value: string | number;
  icon: any;
  sub: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default AnalyticsCharts;
