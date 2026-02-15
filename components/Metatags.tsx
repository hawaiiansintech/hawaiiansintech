import React from "react";

interface MetaTagsProps {
  description?: string;
  image?: string;
  pathname?: string;
  title?: string;
}

export default function MetaTags({
  description = "A directory and community of Native Hawaiians in the technology industry.",
  image = "https://hawaiiansintech.org/images/logo - hawaiians in tech@44.png",
  pathname = "https://hawaiiansintech.org",
  title = "Hawaiians in Technology",
}: MetaTagsProps) {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />

      {/* <!-- Primary Meta Tags --> */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* <!-- Open Graph / Facebook --/> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pathname} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* <!-- Twitter --/> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pathname} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </>
  );
}
