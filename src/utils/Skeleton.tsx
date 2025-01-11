import React from "react";
import Skeleton from "react-loading-skeleton";

const CardSkeleton = ({ cards }: any) => {
  return Array(cards)
    .fill(0)
    .map((item, i) => (
      <div className="card-skeleton p-[0px]" key={i}>
        <Skeleton className="h-[140px] mb-2" />
        <Skeleton className="h-[24px]" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="" />
          <Skeleton className="" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Skeleton className="" />
          <Skeleton className="" />
        </div>
      </div>
    ));
};

export default CardSkeleton;
