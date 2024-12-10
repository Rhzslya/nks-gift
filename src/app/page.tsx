import Image from "next/image";
import { connect } from "@/dbConfig/dbConfig";
connect();
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <h1>Login For Admin</h1>

        <p>Email : admin@gmail.com</p>
        <p>Password : @Admin123</p>
      </div>
    </main>
  );
}
