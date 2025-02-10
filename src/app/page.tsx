import { connect } from "@/dbConfig/dbConfig";
import HomeViews from "@/views/Home";
connect();
export default function Home() {
  return <HomeViews />;
}
