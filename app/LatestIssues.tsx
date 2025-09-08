import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { IssueStatusBadge } from "./components";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/auth/authOptions";
import { Prisma } from "@prisma/client"; // ✅ Prisma types

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ✅ Define type directly from Prisma (with relation included)
type IssueWithAssignedUser = Prisma.IssueGetPayload<{
  include: { assignedToUser: true };
}>;

const LatestIssues = async () => {
  const session = await getServerSession(authOptions);

  let issues: IssueWithAssignedUser[] = [];

  // Only fetch issues if user is logged in
  if (session) {
    issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        assignedToUser: true,
      },
    });
  }

  return (
    <Card>
      <Heading size="4" mb="5">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Flex justify="between">
                    <Flex direction="column" align="start" gap="2">
                      <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                      <IssueStatusBadge status={issue.status} />
                    </Flex>
                    {issue.assignedToUser && (
                      <Avatar
                        src={issue.assignedToUser.image ?? undefined} // ✅ safer than `!`
                        fallback="?"
                        size="2"
                        radius="full"
                      />
                    )}
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                  }}
                >
                  {session ? "No issues yet" : "Sign in to view issues"}
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
