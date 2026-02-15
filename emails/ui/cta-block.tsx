import { cn } from "@/lib/utils";
import { Column, Text, Row, Section, Button } from "@react-email/components";

export function CTABlockButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      href={href}
      className="rounded border border-solid border-stone-200 px-2 py-1 tracking-wide text-stone-600"
    >
      {children}
    </Button>
  );
}

CTABlock.Button = CTABlockButton;

export default function CTABlock({
  nodes = [<Text>Column 1</Text>, <Text>Column 2</Text>],
  className,
}: {
  className?: string;
  nodes: React.ReactNode[];
}) {
  return (
    <Section
      className={cn(
        "my-4 rounded bg-stone-100 p-2 text-xs text-stone-500",
        className,
      )}
    >
      <Row>
        {nodes?.map((node, i) => (
          <Column
            className={cn(
              "text-center",
              nodes.length >= 2 && `w-1/${nodes.length}`,
              i >= 1 &&
                "sm:border-b-0 sm:border-l sm:border-r-0 sm:border-t-0 sm:border-solid sm:border-l-stone-200",
            )}
            key={`cta-block-${i}`}
          >
            {node}
          </Column>
        ))}
      </Row>
    </Section>
  );
}
