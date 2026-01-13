"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";

const AnalyticsCharts = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Analysis for Last year</CardTitle>
          <CardDescription>Views per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: "300" }}>
            <ResponsiveContainer>
              <LineChart width={1100} height={400}>
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  data={[
                    { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
                    { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
                    { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
                    { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
                    { name: "May", uv: 189, pv: 4800, amt: 2181 },
                    { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
                    { name: "Jul", uv: 349, pv: 4300, amt: 2100 },
                    { name: "Aug", uv: 400, pv: 2400, amt: 2400 },
                    { name: "Sep", uv: 300, pv: 1398, amt: 2210 },
                    { name: "Oct", uv: 200, pv: 9800, amt: 2290 },
                    { name: "Nov", uv: 278, pv: 3908, amt: 2000 },
                    { name: "Dec", uv: 189, pv: 4800, amt: 2181 },
                  ]}
                />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AnalyticsCharts;
