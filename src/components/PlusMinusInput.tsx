import { clamp } from "@/lib/helpers";
import { ControllerRenderProps } from "react-hook-form";

import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

type PlusMinusInputProps = {
  field: ControllerRenderProps<any>;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export const PlusMinusInput: FC<PlusMinusInputProps> = ({ field, min = 0, max = 999, step = 1, className }) => {
  return (
    <div className={twMerge("flex flex-row items-center gap-1", className)}>
      <Button
        size="sm"
        type="button"
        variant="secondary"
        onClick={() => field.onChange(Math.max(min, field.value - step))}
        disabled={field.value <= min}
      >
        <Minus />
        <span className="sr-only">Decrease</span>
      </Button>
      <Input
        {...field}
        className="w-12 text-center"
        type="number"
        step={step}
        onChange={(e) => field.onChange(clamp(min, Number(e.currentTarget.value), max))}
      />
      <Button
        size="sm"
        type="button"
        variant="secondary"
        onClick={() => field.onChange(Math.min(field.value + step, max))}
        disabled={field.value >= max}
      >
        <Plus />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
};
