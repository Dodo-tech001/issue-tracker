import Image from "next/image";
import styles from "./page.module.css";
import Pagination from "./components/Pagination";

export default function Home() {
  return <Pagination itemCount={100} pageSize={10} currentPage={2} />;
}
