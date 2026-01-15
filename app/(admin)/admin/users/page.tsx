"use client";

import React, { useState } from "react";
import { Loader2, UserPlus, Shield, Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetPotentialAgents } from "@/lib/hooks/admin.hook";
import {
  AgentCandidate,
  PromoteUserDialog,
} from "@/components/admin/PromoteUserDialog";

export default function CreateAgentPage() {
  const { data: candidates, isLoading, isError } = useGetPotentialAgents();
  const [selectedUser, setSelectedUser] = useState<AgentCandidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openPromoteDialog = (user: AgentCandidate) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Failed to load candidates. Ensure you are logged in as admin.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Agent Management
          </h1>
          <p className="text-muted-foreground">
            Select eligible taxpayers to promote to agent role.
          </p>
        </div>
      </div>

      <Card className="classic-shadow-sm border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Eligible Candidates
          </CardTitle>
          <CardDescription>
            These users currently hold the 'Taxpayer' role and are active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates && candidates.length > 0 ? (
            <Table>
              <TableHeader className="bg-card">
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        {user.full_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50 text-blue-700 gap-1"
                        onClick={() => openPromoteDialog(user)}
                      >
                        <Shield className="h-4 w-4" />
                        Make Agent
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No eligible taxpayers found. They must be registered and active to
              appear here.
            </div>
          )}
        </CardContent>
      </Card>

      {/* The Dialog Component */}
      <PromoteUserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedUser(null); // Reset on close
        }}
      />
    </div>
  );
}
