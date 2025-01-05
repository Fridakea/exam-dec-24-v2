import { FC } from "react";

type RadioCardProps = {
  id: string;
  value?: string;
  required?: boolean;
  name: string;
  header: string;
  subHeader?: string;
  isChecked?: boolean;
  onChange?: (newValue: string) => void;
};

export const RadioCard: FC<RadioCardProps> = ({
  id,
  value,
  required = true,
  name,
  header,
  subHeader,
  isChecked = false,
  onChange,
}) => {
  return (
    <div>
      <input
        className="peer hidden"
        type="radio"
        id={id}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        required={required}
        value={value ?? id}
        name={name}
      />
      <label
        htmlFor={id}
        className={`${
          isChecked ? "border-accent bg-card drop-shadow-accent" : "bg-card  border-transparent"
        } inline-block w-fit h-fit p-4 border-2 text-card-foreground ~text-lg/xl rounded-md peer-hover:bg-accent peer-hover:text-foreground cursor-pointer`}
      >
        {header}
        <p className="~text-xs/sm">{subHeader}</p>
      </label>
    </div>
  );
};
