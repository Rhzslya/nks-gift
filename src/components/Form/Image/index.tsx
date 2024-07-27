import React from "react";
import Image from "next/image";
const LogoForm = ({ src, alt }: { src: string; alt: string }) => {
  return <Image src={src} alt={alt} width={100} height={100} />;
};

export default LogoForm;
