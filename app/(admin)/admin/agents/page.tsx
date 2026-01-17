"use client";

import { useAdminGetAgents } from "@/lib/hooks/admin.hook";
import React from "react";
import { LayoutGrid, ListFilter } from "lucide-react";
import AgentCard from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminAgentsPage = () => {
  const { data: agents, isLoading, isError } = useAdminGetAgents();

  if (isLoading)
    return (
      <div className="p-8 text-center text-secondary-foreground">
        Loading agents...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Failed to load agents.</div>
    );

  return (
    <div className=" space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agent Management</h1>
          <p className="text-secondary-foreground">
            Manage your field agents and view their stations.
          </p>
        </div>

        <div className="flex gap-3">
          <Button className="" variant={`outline`}>
            <ListFilter size={16} />
            Filter
          </Button>
          <Button className="">
            <Link href={`/admin/users`}>Add New Agent</Link>
          </Button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Grid Layout */}
      {agents && agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent: any) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <LayoutGrid className="text-gray-400" size={32} />
          </div>
          <h3 className="mt-4 text-lg font-medium text-primary">
            No agents found
          </h3>
          <p className="text-secondary-foreground">
            Get started by creating a new agent.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAgentsPage;
