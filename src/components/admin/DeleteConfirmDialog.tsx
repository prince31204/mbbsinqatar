"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  count: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

export function DeleteConfirmDialog({
  open,
  count,
  onConfirm,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 size={18} className="text-[#BC002D]" />
            Delete {count > 1 ? `${count} records` : "record"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.{" "}
            {count > 1 ? `These ${count} records` : "This record"} will be
            permanently deleted from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-[#102A43] hover:bg-[#102A43] text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
