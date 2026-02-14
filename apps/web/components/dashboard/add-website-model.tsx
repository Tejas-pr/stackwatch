"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { AlertCircle, Globe } from "lucide-react";
import { Website } from "../../app/dashboard/page";
import { addNewWebsite } from "../../lib/server";

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebsiteAdded: (website: any) => void;
}

export default function AddWebsiteModal({
  isOpen,
  onClose,
  onWebsiteAdded,
}: AddWebsiteModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Website name is required";
    }

    if (!url.trim()) {
      newErrors.url = "Website URL is required";
    } else if (!isValidUrl(url)) {
      newErrors.url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const res = await addNewWebsite(url);

    if (res.success) {
      onWebsiteAdded(res.response);
      setName("");
      setUrl("");
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Add Website
          </DialogTitle>
          <DialogDescription>
            Add a new website to monitor its uptime and performance metrics
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Website Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., My API Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-secondary/30 transition-colors focus:bg-secondary/50"
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Website URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-border bg-secondary/30 transition-colors focus:bg-secondary/50"
            />
            {errors.url && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.url}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Website
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
