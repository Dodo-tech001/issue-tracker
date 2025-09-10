import Image from "next/image";
import styles from "./page.module.css";
import Pagination from "./components/Pagination";
import LatestIssues from "./LatestIssues";
import IssueSummary from "./IssueSummary";
import prisma from "@/prisma/client";
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/auth/authOptions"; // Adjust this path to match your auth setup

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Only fetch real data if user is logged in, otherwise show zeros
  let open = 0,
    inProgress = 0,
    closed = 0;

  if (session) {
    open = await prisma.issue.count({
      where: { status: "OPEN", assignedToUserId: session.user.id },
    });
    inProgress = await prisma.issue.count({
      where: { status: "IN_PROGRESS", assignedToUserId: session.user.id },
    });
    closed = await prisma.issue.count({
      where: { status: "CLOSED", assignedToUserId: session.user.id },
    });
  }

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
};
