"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Activity,
  Users,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAdminFinanceDashboard } from "@/lib/hooks/admin.hook";

// --- DUMMY DATA ---
const SUMMARY_DATA = {
  totalRevenue: 12500000,
  revenueChange: "+12.5%",
  activeSubscriptions: 1240,
  subChange: "+3.2%",
  avgTransaction: 9200,
  transactionChange: "-1.1%",
  pendingPayouts: 450000,
  pendingChange: "+5.4%",
};

const REVENUE_DATA = [
  { name: "Mon", revenue: 150000 },
  { name: "Tue", revenue: 230000 },
  { name: "Wed", revenue: 180000 },
  { name: "Thu", revenue: 320000 },
  { name: "Fri", revenue: 290000 },
  { name: "Sat", revenue: 450000 },
  { name: "Sun", revenue: 380000 },
];

const TRANSACTIONS_DATA = [
  {
    id: "TRX-9821",
    user: "John Doe",
    plate: "ABC-1234",
    amount: 15000,
    status: "Success",
    date: "2024-03-10",
    method: "Credit Card",
  },
  {
    id: "TRX-9822",
    user: "Sarah Smith",
    plate: "XYZ-9876",
    amount: 8500,
    status: "Processing",
    date: "2024-03-10",
    method: "Bank Transfer",
  },
  {
    id: "TRX-9823",
    user: "Michael Johnson",
    plate: "LMN-4567",
    amount: 22000,
    status: "Success",
    date: "2024-03-09",
    method: "Cash (Agent)",
  },
  {
    id: "TRX-9824",
    user: "Fatima Ali",
    plate: "QWE-2345",
    amount: 5000,
    status: "Failed",
    date: "2024-03-09",
    method: "Credit Card",
  },
  {
    id: "TRX-9825",
    user: "Emmanuel James",
    plate: "RTY-6789",
    amount: 12000,
    status: "Success",
    date: "2024-03-08",
    method: "USSD",
  },
];

export default function FinanceOverview() {
  const [period, setPeriod] = useState("week");
  const { data: financeDashboard, isLoading } =
    useGetAdminFinanceDashboard(period);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Overview
          </h2>
          <p className="text-muted-foreground">
            Track revenue, transactions, and financial health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{SUMMARY_DATA.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3" />
                {SUMMARY_DATA.revenueChange}
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SUMMARY_DATA.activeSubscriptions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3" />
                {SUMMARY_DATA.subChange}
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Transaction
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{SUMMARY_DATA.avgTransaction.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3" />
                {SUMMARY_DATA.transactionChange}
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payouts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{SUMMARY_DATA.pendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3" />
                {SUMMARY_DATA.pendingChange}
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Tables Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Daily revenue performance for the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e5e5"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      `₦${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest financial activity from agents and users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {TRANSACTIONS_DATA.map((trx) => (
                <div key={trx.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {trx.user}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="font-mono mr-2 bg-muted px-1.5 py-0.5 rounded">
                        {trx.plate}
                      </span>
                      {trx.method}
                    </div>
                  </div>
                  <div className="ml-auto font-medium text-right">
                    <div
                      className={
                        trx.status === "Failed"
                          ? "text-destructive"
                          : "text-green-600"
                      }
                    >
                      {trx.status === "Failed" ? "-" : "+"}₦
                      {trx.amount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">{trx.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm">
              View All Transactions <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Performance Metrics can go here visually */}
      </div>
    </div>
  );
}
