import React from "react";
import Link from "next/link";
const FormLink = ({
  href,
  text,
  textLink,
}: {
  href: string;
  text: string;
  textLink: string;
}) => {
  return (
    <span className="text-sm">
      {text}{" "}
      <Link
        href={href}
        className="text-sky-500 hover:text-sky-300 duration-300"
      >
        {textLink}
      </Link>
    </span>
  );
};

export default FormLink;
