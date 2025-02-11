import Image from "next/image";
import { connect } from "@/dbConfig/dbConfig";
connect();
export default function HomeViews() {
  return (
    <main className="home_root my-14 px-14 pt-40 flex min-h-screen flex-col items-center">
      <div className="big-title">
        <h1
          className="text-gray-200 font-bold text-center"
          style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
        >
          NKS Gift Store
        </h1>
      </div>
      <div className="text-gray-200 p-6 px-11 font-medium text-xl text-center leading-loose">
        <p className="2xl:mx-96" style={{ fontSize: "clamp(1rem,2vw,20px)" }}>
          &quot;We offer a variety of creative gifts, including snack towers,
          money cakes, and buckets, perfect for making your celebrations even
          more special&quot;
        </p>
      </div>
    </main>
  );
}
