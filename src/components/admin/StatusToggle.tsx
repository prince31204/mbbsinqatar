"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type StatusToggleProps = {
  id: string | number;
  status: boolean;
  onToggle: (id: string | number, status: boolean) => Promise<void>;
};

export function StatusToggle({
  id,
  status: initialStatus,
  onToggle,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (checked: boolean) => {
    setLoading(true);
    const prev = status;
    setStatus(checked); // optimistic
    try {
      await onToggle(id, checked);
    } catch {
      setStatus(prev); // rollback
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={status}
      onCheckedChange={handleChange}
      disabled={loading}
      className="data-[state=checked]:bg-red-500"
      aria-label="Toggle status"
    />
  );
}
