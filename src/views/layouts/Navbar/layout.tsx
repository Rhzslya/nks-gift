// import React from "react";
// import Link from "next/link";
// import Navbar from "@/views/Navbar";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
// type User = {
//   username: string;
//   profileImage: string;
// };

// const NavbarLayout = async () => {
//   const session = await getServerSession(authOptions);
//   console.log(session);
//   const user = session?.user as User;
//   return <Navbar user={user} />;
// };

// export default NavbarLayout;
