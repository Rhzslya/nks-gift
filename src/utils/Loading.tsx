import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReactLoading from "react-loading";

import React from "react";

export const LoadingTable = () => {
  return <Skeleton />;
};

export const Spinner = ({ type, color, height, width }: any) => {
  return (
    <ReactLoading type={type} color={color} height={height} width={width} />
  );
};
