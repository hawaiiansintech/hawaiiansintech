import Head from "next/head";
import MetaTags from "../../components/Metatags.js";
import { Heading, Subheading } from "../../components/Heading";
import {
  StatusIndicator,
  StatusIndicatorType,
} from "../../components/StatusIndicator";
import { GetServerSideProps } from "next";
import { server } from "../../config";
import {
  MemberStatusOption,
  MemberStatusProps,
} from "../api/get-member-status";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<MemberStatusProps> = async (
  context
) => {
  const { query } = context;
  const getMemberStatus = async () => {
    return new Promise((resolve, reject) => {
      fetch(`${server}/api/get-member-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordID: query.r,
        }),
      }).then(
        (response: Response) => {
          resolve(response);
        },
        (error: Response) => {
          reject(error);
        }
      );
    });
  };
  const res: any = await getMemberStatus();
  const memberRes: MemberStatusProps = await res.json();
  if (memberRes.error) {
    return { props: { error: memberRes.error } };
  } else {
    return {
      props: {
        name: memberRes.name ? memberRes.name : null,
        status: memberRes.status ? memberRes.status : null,
        reviewed: memberRes.reviewed ? true : false,
        reasonDeclined: memberRes.reasonDeclined
          ? memberRes.reasonDeclined
          : null,
      },
    };
  }
};

export default function Status({
  name,
  reviewed,
  error,
  status,
  reasonDeclined,
}: MemberStatusProps) {
  const approved = reviewed && status === MemberStatusOption.Approved;
  const declined = reviewed && status === MemberStatusOption.Declined;
  const hasFeedback = reviewed && status === MemberStatusOption.HasFeedback;

  const renderHeadline = (): string => {
    if (error) {
      return error;
    } else if (hasFeedback) {
      return `Your profile has feedback.`;
    } else if (declined) {
      return `Your profile has been declined (perhaps, just this time).`;
    } else if (approved) {
      return `Your profile has been approved and published!`;
    }
    return `Mahalo for your patience, ${name}.`;
  };
  const getStatusIndicatorType = (): StatusIndicatorType => {
    if (hasFeedback) {
      return StatusIndicatorType.HasFeedback;
    } else if (declined || error) {
      return StatusIndicatorType.Declined;
    } else if (approved) {
      return StatusIndicatorType.Approved;
    }
    return StatusIndicatorType.InProgress;
  };
  const getDescription = (): string => {
    if (hasFeedback) {
      return "We've reviewed your entry but might have some questions or adjustments to talk about. Please check the email you signed up with for our response.";
    } else if (declined) {
      return "We've reviewed your entry but, through careful consideration, we found that your profile may not be a fit for our community. Please feel free to reach out and/or try again at a later time!";
    } else if (approved) {
      return "We’ve reviewed your entry and everything checks out! There’s nothing else you need to you. Welcome to our little hui.";
    } else if (!error) {
      return "Your profile is in the queue for review. Once everything checks out, we'll let you know that it's been published on the list, or if we have any questions / requested adjustments.";
    }
  };
  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | Status</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <div
        style={{
          maxWidth: "var(--page-interior-width)",
          margin: "0 auto 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!error && (
          <div
            style={{
              borderRadius: "var(--border-radius-x-small)",
              background: "var(--color-background-alt)",
              padding: "1rem",
              margin: "0 0 2rem",
            }}
          >
            This message is meant for {name}. <Link href="/">Not you?</Link>
          </div>
        )}
        <StatusIndicator type={getStatusIndicatorType()} />
        <div style={{ marginTop: "2rem" }}>
          <Heading>{renderHeadline()}</Heading>
        </div>
        <Subheading centered>{getDescription()}</Subheading>
        {declined && reasonDeclined && (
          <div
            style={{
              padding: "1rem",
              background: "var(--color-background-alt-2)",
              borderRadius: "var(--border-radius-medium)",
              color: "var(--color-text-alt-2)",
              marginTop: "2rem",
            }}
          >
            {reasonDeclined.map((reason) => (
              <p>{reason}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
