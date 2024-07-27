import Image from "next/image";
import { connect } from "@/dbConfig/dbConfig";
connect();
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
