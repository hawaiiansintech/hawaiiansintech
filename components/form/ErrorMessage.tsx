import { cn } from "@/lib/utils";
import { ErrorSVG } from "../icon/ErrorSVG";
import { Icon, IconAsset, IconColor } from "../icon/icon";

export interface ErrorMessageProps {
  headline: string;
  body: string;
  warning?: boolean;
  onClose?: () => void;
}

export default function ErrorMessage({
  headline,
  body,
  warning,
  onClose,
}: ErrorMessageProps) {
  return (
    <div
      className={cn("relative flex space-x-4 rounded-lg border-2 p-4", {
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
      {onClose && (
        <button className="absolute right-0 top-0" onClick={onClose}>
          <Icon asset={IconAsset.Close} color={IconColor.Inherit} />
        </button>
      )}
    </div>
  );
}
