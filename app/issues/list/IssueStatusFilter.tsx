"use client";

import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

// Define statuses with consistent typing
const statuses: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the initial status, defaulting to an empty string for "All"
  const initialStatus = searchParams.get("status") || "";

  const handleValueChange = (status: string) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (searchParams.get("orderBy"))
      params.append("orderBy", searchParams.get("orderBy")!);
    const query = params.size ? "?" + params.toString() : "";
    router.push("/issues/list" + query);
  };

  // Determine the display text for the trigger
  const selectedStatus = statuses.find((s) => s.value === initialStatus);
  const triggerText = selectedStatus
    ? selectedStatus.label
    : "Filter by status...";

  return (
    <Select.Root value={initialStatus} onValueChange={handleValueChange}>
      <Select.Trigger>
        <span className="text-gray-500">{triggerText}</span>
      </Select.Trigger>
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
