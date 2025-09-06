"use client";

import { Skeleton } from "@/app/components";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users = [], error, isLoading } = useUsers();

  if (isLoading) return <Skeleton />;

  if (error) return null;

  const assignIssue = (userId: string) => {
    axios
      .patch(`/api/issues/${issue.id}`, {
        assignedToUserId: userId || null,
      })
      .catch(() => {
        toast.error("Changes could not be saved.");
      });
  };

  // Determine the display text for the trigger
  const selectedUser = users.find((user) => user.id === issue.assignedToUserId);
  const triggerText = selectedUser ? selectedUser.name : "Assign";

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || ""}
        onValueChange={assignIssue}
      >
        <Select.Trigger>
          <span className="text-gray-500">{triggerText}</span>
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, // Cache for 1 minute
    retry: 3, // Retry up to 3 times on failure
  });

export default AssigneeSelect;
