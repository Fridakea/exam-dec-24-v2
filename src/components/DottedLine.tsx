import { FC } from "react";
import { twMerge } from "tailwind-merge";

type DottedLineProps = {
  className?: string;
  amount?: number;
};

export const DottedLine: FC<DottedLineProps> = ({ className = "", amount = 10 }) => {
  const dotArray = Array.from({ length: amount });

  return (
    <div className="w-full flex flex-row flex-grow-1 gap-6 justify-between overflow-hidden">
      {dotArray.map((_, i) => (
        <div key={i} className={twMerge(className, "bg-background w-8 h-0.5")} />
      ))}
    </div>
  );
};
