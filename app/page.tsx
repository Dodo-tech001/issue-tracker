import Image from "next/image";
import styles from "./page.module.css";
import Pagination from "./components/Pagination";
import LatestIssues from "./LatestIssues";

export default function Home() {
  return <LatestIssues />;
}
