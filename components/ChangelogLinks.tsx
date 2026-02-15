import React, { useState } from "react";
import Link from "next/link";
import { Calendar, GitPullRequestArrow, FileText } from "lucide-react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

interface ChangelogLinksProps {
  links: string[];
}

type LinkType =
  | "github-pr"
  | "linkedin"
  | "meetup"
  | "hawaiians-tech"
  | "news"
  | "unknown";

const getLinkType = (link: string): LinkType => {
  if (link.includes("github.com") && link.includes("/pull/"))
    return "github-pr";
  if (link.includes("linkedin.com")) return "linkedin";
  if (link.includes("meetup.com")) return "meetup";
  if (link.includes("hawaiiansintech.org/hackathon")) return "hawaiians-tech";
  if (link.includes("/news/")) return "news";
  return "unknown";
};

const getLinkIcon = (type: LinkType) => {
  switch (type) {
    case "github-pr":
      return <GitPullRequestArrow className="h-5 w-5" />;
    case "linkedin":
      return <LinkedInLogoIcon className="h-5 w-5" />;
    case "meetup":
    case "hawaiians-tech":
      return <Calendar className="h-5 w-5" />;
    case "news":
      return <FileText className="h-5 w-5" />;
    default:
      return null;
  }
};

const getLinkContent = (type: LinkType, link: string) => {
  switch (type) {
    case "github-pr":
      return (
        <>
          <h3>Pull Request #{link.split("/").pop()}</h3>
          <span className="flex items-center gap-1 truncate text-xs text-secondary-foreground">
            <GitHubLogoIcon className="size-3 flex-shrink-0" />
            {link.split("/")[3]}/{link.split("/")[4]}
          </span>
        </>
      );
    case "linkedin":
      return (
        <>
          <h3>Community Post</h3>
          <div className="truncate text-xs text-secondary-foreground">
            /{link.split("/")[4]}
          </div>
        </>
      );
    case "meetup":
      return (
        <>
          <h3>Event Page</h3>
          <div className="truncate text-xs text-secondary-foreground">
            Meetup
          </div>
        </>
      );
    case "hawaiians-tech":
      return (
        <>
          <h3>Event Page</h3>
          <div className="truncate text-xs text-secondary-foreground">
            Hawaiians in Tech
          </div>
        </>
      );
    case "news":
      return (
        <>
          <h3>News</h3>
          <div className="truncate text-xs text-secondary-foreground">
            {link.split("/news/")[1].replace(/-/g, " ")}
          </div>
        </>
      );
    default:
      return null;
  }
};

const ChangelogLinks: React.FC<ChangelogLinksProps> = ({ links }) => {
  const [showAll, setShowAll] = useState(false);

  if (links.length < 1) return null;

  const displayedLinks = showAll ? links : links.slice(0, 4);

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {displayedLinks.map((link, index) => {
        const linkType = getLinkType(link);
        const icon = getLinkIcon(linkType);
        const content = getLinkContent(linkType, link);

        return (
          <Link
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-2 bg-tan-300/50 p-2 text-sm font-medium text-foreground hover:bg-tan-300/70 hover:no-underline active:bg-tan-300"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {icon && (
                <div className="rounded-full border p-2 text-secondary-foreground">
                  {icon}
                </div>
              )}
              <div>{content}</div>
            </div>
          </Link>
        );
      })}
      {!showAll && links.length > 4 && (
        <Button
          variant="outline"
          size="sm"
          className="md:col-span-2"
          onClick={() => setShowAll(true)}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default ChangelogLinks;
