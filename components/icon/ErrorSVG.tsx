import { cn } from "@/lib/utils";
import { FC } from "react";

export interface ErrorSVGProps {
  warning?: boolean;
}

export const ErrorSVG: FC<ErrorSVGProps> = ({ warning }) => (
  <svg
    viewBox="0 0 36 36"
    width="36"
    height="36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={cn({
        "fill-red-500": !warning,
        "fill-amber-500": warning,
      })}
      fillRule="evenodd"
      clipRule="evenodd"
      d="m20.783 2.316 1.714 2.121a60 60 0 0 1 10.41 19.231l1.276 3.945a4 4 0 0 1-3.31 5.2l-5.76.72a59.997 59.997 0 0 1-14.883 0l-5.76-.72a4 4 0 0 1-3.31-5.2l1.276-3.945a60 60 0 0 1 10.41-19.23l1.714-2.122a4 4 0 0 1 6.223 0Zm-2.228 20.628a1 1 0 0 0 1-.963l.518-14.195a1 1 0 0 0-1-1.036h-3.289a1 1 0 0 0-.999 1.036l.52 14.194a1 1 0 0 0 .998.964h2.252Zm.912 3.226c-.511-.46-1.19-.69-2.038-.69-.836 0-1.515.235-2.037.706-.511.46-.767 1.043-.767 1.75 0 .706.256 1.289.767 1.749.522.46 1.201.69 2.037.69.848 0 1.527-.23 2.038-.69.522-.46.783-1.043.783-1.75 0-.716-.26-1.305-.783-1.765Z"
    />
  </svg>
);
