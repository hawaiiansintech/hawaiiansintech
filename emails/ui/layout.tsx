import { cn } from "@/lib/utils";
import { Container } from "@react-email/components";

export default function Layout({
  children,
  border = true,
  className,
}: {
  children: React.ReactNode;
  border?: boolean;
  className?: string;
}) {
  return (
    <Container
      className={cn(
        "mx-auto max-w-[540px] rounded-xl p-4 pt-6",
        border && "border border-solid border-stone-200",
        className,
      )}
    >
      {children}
    </Container>
  );
}
