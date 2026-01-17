"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminGetAgent } from "@/lib/hooks/admin.hook";

const AgentDetailsPage = () => {
  const params = useParams();
  const agentId = params.agentId;
  console.log("agentId", agentId);

  const { data: agent, isLoading } = useAdminGetAgent(agentId as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-secondary-foreground">Loading agent details...</p>
      </div>
    );
  }

  const displayName = agent.full_name?.trim()
    ? agent.full_name
    : "Unnamed Agent";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <Link
        href="/admin/agents"
        className="inline-flex items-center text-sm text-secondary-foreground hover:text-primary"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Agents
      </Link>

      {/* Main Content Area */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-accent"></div>

        <div className="px-8 pb-8">
          {/* Profile Header */}
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="flex items-end gap-6">
              <div className="h-24 w-24 rounded-xl ring-4 ring-white bg-gray-200 flex items-center justify-center text-2xl font-bold text-secondary-foreground">
                {/* Avatar Placeholder */}
                {displayName.charAt(0)}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-primary">
                  {displayName}
                </h1>
                <p className="text-secondary-foreground">{agent.user.email}</p>
              </div>
            </div>

            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  agent.active_status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {agent.active_status === "active" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {agent.active_status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
            {/* Column 1: Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary text-lg">
                Personal Information
              </h3>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <span className="text-secondary-foreground">Full Name</span>
                <span className="col-span-2 text-primary font-medium">
                  {displayName}
                </span>

                <span className="text-secondary-foreground">Email</span>
                <span className="col-span-2 text-primary font-medium">
                  {agent.user.email}
                </span>

                <span className="text-secondary-foreground">Phone</span>
                <span className="col-span-2 text-primary font-medium font-mono">
                  {agent.phone}
                </span>
              </div>
            </div>

            {/* Column 2: Assignment Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary text-lg">
                Assignment Details
              </h3>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <span className="text-secondary-foreground">Station</span>
                <span className="col-span-2 text-primary font-medium uppercase">
                  {agent.station_location}
                </span>

                <span className="text-secondary-foreground">Role</span>
                <span className="col-span-2 text-primary font-medium capitalize">
                  {agent.user.role}
                </span>

                <span className="text-secondary-foreground">User ID</span>
                <span className="col-span-2 text-secondary-foreground text-xs font-mono">
                  {agent.user.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsPage;
