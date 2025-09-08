import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { IssueStatusBadge } from "./components";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LatestIssues = async () => {
  console.log("LatestIssues: Fetching at", new Date().toISOString());

  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  console.log("LatestIssues: Found", issues.length, "issues");
  if (issues.length > 0) {
    console.log(
      "LatestIssues: Most recent:",
      issues[0].title,
      issues[0].createdAt
    );
  }

  return (
    <Card>
      <Heading size="4" mb="5">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issues) => (
            <Table.Row key={issues.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" align="start" gap="2">
                    <Link href={`/issues/${issues.id}`}>{issues.title}</Link>
                    <IssueStatusBadge status={issues.status} />
                  </Flex>
                  {issues.assignedToUser && (
                    <Avatar
                      src={issues.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
