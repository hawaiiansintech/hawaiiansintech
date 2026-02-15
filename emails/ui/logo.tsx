import { cn } from "@/lib/utils";
import { Img } from "@react-email/components";

export default function Logo({
  align = "center",
}: {
  align?: "left" | "center" | "right";
}) {
  return (
    <Img
      src="https://tj8xrxsxqdtxeknk.public.blob.vercel-storage.com/email/logo-hawaiiansintech-xs-FL3C71uYfwNZ41s5VriRQ2eUq9ClR6.png"
      alt="Hawaiians in Tech"
      className={cn(
        `mb-4 w-20`,
        align === "center" && "mx-auto",
        align === "right" && "ml-auto",
      )}
    />
  );
}
