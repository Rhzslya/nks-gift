import Image from "next/image";
import { connect } from "@/dbConfig/dbConfig";
connect();
export default function HomeViews() {
  return (
    <main className="home_root my-14 px-14 pt-40 flex min-h-screen flex-col items-center justify-between">
      <div className="big-title">
        <h1 className="text-7xl text-gray-200 font-medium">NKS Gift Store</h1>
      </div>
    </main>
  );
}
