"use client";

import React, { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { usePromoteToAgent } from "@/lib/hooks/admin.hook";

// Define types based on the backend serializer
export interface AgentCandidate {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
}

interface PromoteUserDialogProps {
  user: AgentCandidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PromoteUserDialog = ({
  user,
  open,
  onOpenChange,
}: PromoteUserDialogProps) => {
  const [station, setStation] = useState("");
  const { mutate: promote, isPending } = usePromoteToAgent();

  const handlePromote = () => {
    if (!user) return;
    promote(
      { user_id: user.id, station_location: station },
      {
        onSuccess: () => {
          setStation("");
          onOpenChange(false);
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            Promote to Agent
          </DialogTitle>
          <DialogDescription>
            You are about to give <strong>{user.full_name}</strong> admin-level
            privileges to collect taxes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="station">Assign Station/Location (Optional)</Label>
            <Input
              id="station"
              placeholder="e.g., Central Market Park"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This helps track where the agent operates.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePromote}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Promotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
