import { cn } from "@/lib/utils";
import { Column, Text, Row, Section } from "@react-email/components";

export default function List({
  nodes = [
    { icon: "🤙🏽", label: <Text>Column 1</Text> },
    { icon: "💥", label: <Text>Column 2</Text> },
  ],
}: {
  nodes: { icon: React.ReactNode; label: React.ReactNode }[];
}) {
  return (
    <Section className="text-xs sm:text-sm">
      {nodes?.map(({ icon, label }, i) => (
        <Row className={cn(i > 0 && i < nodes.length - 1 && "my-2")} key={i}>
          <Column className="w-16 text-center text-4xl">{icon}</Column>
          <Column>{label}</Column>
        </Row>
      ))}
    </Section>
  );
}
