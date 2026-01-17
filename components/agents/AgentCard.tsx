'"use client";';

import React from "react";
import { MapPin, Phone, Mail, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AgentType } from "@/lib/types/user.types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface AgentCardProps {
  agent: AgentType;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  // Fallback for empty names based on your data sample
  const displayName = agent.full_name?.trim()
    ? agent.full_name
    : "Unnamed Agent";

  // Status color logic
  const isActive = agent.active_status === "active";
  const statusColor = isActive
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-gray-100 text-secondary-foreground border-border";
  const router = useRouter();

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
      {/* Header: Avatar & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-primary">{displayName}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColor}`}
            >
              {agent.active_status}
            </span>
          </div>
        </div>
      </div>

      {/* Body: Details */}
      <div className="space-y-2 text-sm text-accent-foreground mb-6">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{agent.station_location || "No Station Assigned"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <span className="truncate">{agent.user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-400" />
          {/* Note: Your data shows a timestamp for phone, displayed as is */}
          <span className="truncate">{agent.phone}</span>
        </div>
      </div>

      {/* Footer: Action */}
      <div className="mt-auto pt-4 border-t space-x-2 border-border ">
        <Button
          onClick={() => router.push(`/admin/agents/${agent.id}`)}
          className=""
        >
          View Details
          <ChevronRight size={16} />
        </Button>
        <Button>Suspend</Button>
      </div>
    </div>
  );
};

export default AgentCard;
