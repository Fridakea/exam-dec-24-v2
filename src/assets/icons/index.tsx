import { twMerge } from "tailwind-merge";

export const TicketIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 370 100"
    fill="none"
    className={twMerge("text-background", className)}
    preserveAspectRatio="none"
  >
    <path
      d="M0 0H370V25C370 25 343.805 25 343.805 50C343.805 75 370 75 370 75V100H0V75C0 75 26.1947 75 26.1947 50C26.1947 25 0 25 0 25V0Z"
      fill="currentColor"
    />
  </svg>
);
