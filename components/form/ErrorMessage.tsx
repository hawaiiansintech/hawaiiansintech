import { cn } from "helpers";
import { ErrorSVG } from "../icon/ErrorSVG";

export interface ErrorMessageProps {
  headline: string;
  body: string;
  warning?: boolean;
}

export default function ErrorMessage({
  headline,
  body,
  warning,
}: ErrorMessageProps) {
  return (
    <div
      className={cn("flex space-x-4 rounded-lg border-2 p-4", {
        "bg-red-300/30": !warning,
        "border-red-300": !warning,
        "bg-amber-500/20": warning,
        "border-amber-400": warning,
      })}
    >
      <aside>
        <ErrorSVG warning={warning} />
      </aside>
      <main className="space-y-1">
        <h3 className="font-semibold">{headline}</h3>
        <h4 className="text-sm">{body}</h4>
      </main>
    </div>
  );
}
