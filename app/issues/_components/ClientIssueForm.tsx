// app/issues/_components/ClientIssueForm.tsx
"use client";

import dynamic from "next/dynamic";
import IssueFormSkeleton from "./IssueFormSkeleton";
import { Issue } from "@prisma/client";

// Dynamically import IssueForm with SSR disabled
const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

interface Props {
  issue?: Issue;
}

export default function ClientIssueForm({ issue }: Props) {
  return <IssueForm issue={issue} />;
}
