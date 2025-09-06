import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  // Await searchParams before using its properties
  const params = await searchParams;

  const statuses = Object.values(Status);
  const status = statuses.includes(params.status) ? params.status : undefined;
  const where = { status };

  const orderBy = columnNames.includes(params.orderBy)
    ? { [params.orderBy]: "asc" }
    : undefined;

  const page = parseInt(params.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  // Create a plain object to pass to client components
  const searchParamsObject = {
    status: params.status,
    orderBy: params.orderBy,
    page: params.page,
  };

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParamsObject} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};

export default IssuesPage;
