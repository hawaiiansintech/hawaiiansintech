import Balloon from "@/components/Balloon";
import Button from "@/components/Button";
import ErrorMessage from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags.js";
import {
  StatusIndicator,
  StatusIndicatorType,
} from "@/components/StatusIndicator";
import {
  MemberStatusOption,
  MemberStatusProps,
} from "@/pages/api/get-member-status";
import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
// TODO FIX SERVER LINK ON PRODUCTION
import { server } from "../../config";

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
        modifiedOn: memberRes.modifiedOn ? memberRes.modifiedOn : null,
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
  modifiedOn,
}: MemberStatusProps) {
  const router = useRouter();
  const defaultIdFromQuery = router.query.r
    ? Array.isArray(router.query.r)
      ? router.query.r[0]
      : router.query.r
    : undefined;
  const [searchField, setSearchField] = useState(defaultIdFromQuery);
  const approved = reviewed && status === MemberStatusOption.Approved;
  const declined = reviewed && status === MemberStatusOption.Declined;
  const hasFeedback = reviewed && status === MemberStatusOption.HasFeedback;
  const renderError = () => {
    if (error && defaultIdFromQuery) {
      return (
        <ErrorMessage
          headline={error}
          body={`${defaultIdFromQuery} does not exist. Please try another.`}
        />
      );
    }
  };
  const renderBalloon = (): React.ReactNode => {
    if (name) {
      return (
        <Balloon
          message={`This message was intended for ${name}.`}
          link={{ label: "Not you?", href: "/join/status" }}
        />
      );
    }
  };
  const renderSearch = (): React.ReactNode | undefined => {
    if (name && !error) {
      return <></>;
    }
    return (
      <form style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            name="search-field"
            placeholder="Enter record ID"
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
            defaultValue={
              router.query.r
                ? Array.isArray(router.query.r)
                  ? router.query.r[0]
                  : router.query.r
                : undefined
            }
          />
        </div>
        <div style={{ margin: "0 auto", maxWidth: "24rem" }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (searchField === router.query.r) return;
              router.push(`${router.pathname}?r=${searchField}`);
            }}
            fullWidth
            disabled={searchField === router.query.r}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    );
  };

  const getHeadline = (): string => {
    if (hasFeedback) {
      return `Your profile has feedback.`;
    } else if (declined) {
      return `Your profile has been declined (perhaps, just this time).`;
    } else if (approved) {
      return `Your profile has been approved and published!`;
    } else if (name) {
      return `Your profile is in the queue for review.`;
    }
    return `Search for your profile’s status`;
  };

  const getStatusIndicatorType = (): StatusIndicatorType | null => {
    if (hasFeedback) {
      return StatusIndicatorType.HasFeedback;
    } else if (declined) {
      return StatusIndicatorType.Declined;
    } else if (approved) {
      return StatusIndicatorType.Approved;
    } else if (name) {
      return StatusIndicatorType.InProgress;
    }
    return null;
  };
  const getDescription = (): string => {
    if (hasFeedback) {
      return "We've reviewed your entry but might have some questions or adjustments to talk about. Please check the email you signed up with for our response.";
    } else if (declined) {
      return "We've reviewed your entry but, through careful consideration, we found that your profile may not be a fit for our community. Please feel free to reach out and/or try again at a later time!";
    } else if (approved) {
      return "We’ve reviewed your entry and everything checks out! There’s nothing else you need to you. Welcome to our little hui.";
    } else if (name) {
      return "Mahalo for your patience. Once everything checks out, we'll let you know that it's been published on the list, or if we have any questions / requested adjustments.";
    }
    return null;
  };
  return (
    <>
      <div className="container">
        <Head>
          <title>Hawaiians in Technology | Status</title>
          <link rel="icon" href="/favicon.ico" />
          <MetaTags />
        </Head>
        <div
          style={{
            maxWidth: "var(--width-page-interior)",
            margin: "0 auto 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {getStatusIndicatorType() ? (
            <StatusIndicator type={getStatusIndicatorType()} />
          ) : (
            <img
              src={"/images/HitLogoNoBackground.png"}
              alt="website logo"
              style={{
                width: "120px",
              }}
            />
          )}
          <div style={{ marginTop: "2rem" }}>
            <Heading>{getHeadline()}</Heading>
          </div>
          {renderError()}
          {getDescription() && (
            <Subheading centered>{getDescription()}</Subheading>
          )}
          {renderSearch()}
          {declined && reasonDeclined && (
            <div className="status-rule-box">
              {reasonDeclined.map((reason) => (
                <p>{reason}</p>
              ))}
            </div>
          )}
        </div>
        {modifiedOn && (
          <p className="status-last-modified">
            Last updated {moment(modifiedOn, "YYYYMMDD").fromNow()}
          </p>
        )}
      </div>
      {renderBalloon()}
      <style jsx>{`
        .container {
          padding-bottom: 4rem;
        }
        .status-rule-box {
          padding: 1rem;
          background: var(--color-background-alt);
          border-radius: var(--border-radius-medium);
          color: var(--color-text-alt-2);
          margin-top: 2rem;
        }
        .status-last-modified {
          font-weight: 400;
          font-style: italic;
          text-align: center;
          color: var(--color-text-alt-2);
        }
      `}</style>
    </>
  );
}
