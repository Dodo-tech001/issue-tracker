import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import ClientIssueForm from "../../_components/ClientIssueForm";

// const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
//   ssr: false,
//   loading: () => <IssueFormSkeleton />,
// });

interface Props {
  params: Promise<{ id: string }>;
}

const EditIssuePage = async (props: Props) => {
  const params = await props.params;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue) notFound();
  return <ClientIssueForm issue={issue} />;
};

export default EditIssuePage;
