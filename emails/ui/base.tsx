import { Body, Head, Html, Preview, Tailwind } from "@react-email/components";
const tailwindConfig = require("../../tailwind.config.js");

export default function Base({
  children,

  preview,
  title,
  align = "center",
}: {
  children: React.ReactNode;
  preview?: string;
  title?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <Html>
      {preview && <Preview>{preview}</Preview>}
      <Tailwind config={tailwindConfig}>
        {title && (
          <Head>
            <title>{title}</title>
          </Head>
        )}
        <Body
          className="font-sans text-stone-800"
          style={{
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
          }}
        >
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
}
