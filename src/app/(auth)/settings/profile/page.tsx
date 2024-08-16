import React from "react";
import ProfileViews from "@/views/Settings/ProfileViews";
const Profile = ({ serverSession }: any) => {
  return <ProfileViews serverSession={serverSession} />;
};

export default Profile;
