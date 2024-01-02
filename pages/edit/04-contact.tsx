import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/form/ProgressBar";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import Plausible from "@/components/Plausible";
import Tag from "@/components/Tag";
import { MemberPublic, MemberPublicEditing } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import * as Yup from "yup";

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "Request Changes · Hawaiians in Technology",
    },
  };
}
export default function JoinStep4({ pageTitle }) {
  const router = useRouter();
  const { removeRequest } = router.query;
  const { getItem, removeItem } = useStorage();
  const [other, setOther] = useState<string>("");
  const [userData, setUserData] = useState<MemberPublicEditing>({});
  const [editedData, setEditedData] = useState<MemberPublicEditing>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessageProps>(undefined);

  const submitRequest = async () => {
    return new Promise((resolve, reject) => {
      fetch("/api/create-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData,
          editedData,
          message: other,
          email: userData.emailAbbr ? userData.emailAbbr : undefined,
          name: editedData.name || userData.name,
          firebaseId: userData.id || "",
          removeRequest: removeRequest,
        }),
      }).then(
        (response: Response) => {
          resolve(response);
        },
        (error: Response) => {
          reject(error);
        },
      );
    });
  };

  useEffect(() => {
    let userData: string = getItem("userData");
    userData = userData ? JSON.parse(userData) : undefined;
    if (userData && typeof userData !== "string") {
      setUserData(userData);
    } else {
      router.push("/edit");
    }

    let modified: string | MemberPublicEditing = getItem("editedData");
    modified = modified ? JSON.parse(modified) : {};
    if (modified && typeof modified !== "string") {
      setEditedData(modified);
    }
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(undefined);
    const res: Response | any = await submitRequest();
    const resJSON = await res.json();
    if (res.ok) {
      removeItem("userData");
      removeItem("editData");
      const query = {
        email: userData.emailAbbr ? "true" : "null",
        id: resJSON.id ? resJSON.id : "null",
        removeRequest: removeRequest,
      };
      router.push({
        pathname: "thank-you",
        query: query,
      });
    } else if (res.status === 422) {
      setLoading(false);
      setError({
        headline: resJSON.error,
        body: resJSON.body,
      });
    } else {
      setLoading(false);
      setError({
        headline: "Gonfunnit, looks like something went wrong!",
        body: "Please try again later.",
      });
    }
  };

  return (
    <>
      <Head>
        <Plausible />
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>

      <Nav backUrl={removeRequest ? "/edit" : "03-company"} />
      <Heading>
        {removeRequest ? "Removal Request" : "Requesting changes"} for{" "}
        {userData.name}
      </Heading>
      {userData.emailAbbr ? (
        <Subheading centered>
          {removeRequest ? (
            <>
              We are working on automating this process. For now, please reach
              out to{" "}
            </>
          ) : (
            <>
              Once you submit, expect one of us to review and confirm these
              changes with you at <strong>{userData.emailAbbr}</strong>. If you
              don&rsquo;t hear soon, please reach out to{" "}
            </>
          )}
          <Link href="mailto:kekai@hawaiiansintech.org" target="_blank">
            kekai@hawaiiansintech.org
          </Link>{" "}
          or{" "}
          <Link href="mailto:kamakani@hawaiiansintech.org" target="_blank">
            kamakani@hawaiiansintech.org
          </Link>{" "}
          and we&rsquo;ll get you sorted out.
        </Subheading>
      ) : (
        <div className="email-alert">
          <div className="email-alert__container">
            <Tag>Verification needed</Tag>
            <div className="email-alert__content">
              <h3>
                <strong>Shoot, we don't have your email.</strong> More details
                on how we'll verify after you submit this form. Should be easy.{" "}
                <strong>Anything else, use the field below.</strong>
              </h3>
            </div>
          </div>
          <style jsx>{`
            .email-alert {
              margin: 0 auto;
              max-width: ${theme.layout.width.interior};
            }
            .email-alert__container {
              background: ${theme.color.background.alt};
              margin: 0 2rem;
              padding: 1.5rem;
              border-radius: ${theme.borderRadius.sm};
            }
            h3 {
              font-weight: 400;
              font-size: 1rem;
              margin: 0.5rem 0 0;
            }
            h4 {
              font-weight: 400;
              font-size: 0.875rem;
              margin: 0;
            }
          `}</style>
        </div>
      )}
      <section
        style={{
          margin: "2rem auto 0",
          padding: "0 2rem",
          maxWidth: theme.layout.width.interior,
        }}
      >
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage headline={error.headline} body={error.body} />
          </div>
        )}
        <DiffTable userData={userData} editedData={editedData} />

        {!removeRequest && (
          <Formik
            enableReinitialize
            initialValues={{ other: other }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              other: Yup.string(),
            })}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Input
                  name="other"
                  label="Anything else?"
                  labelTranslation="He mau manaʻo hou aku kou?"
                  onBlur={props.handleBlur}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  error={props.touched.other && props.errors.other}
                />
                <div style={{ margin: "2rem auto 0", maxWidth: "24rem" }}>
                  <Button fullWidth loading={loading} type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </section>
      {removeRequest ? (
        <></>
      ) : (
        <div style={{ margin: "1rem 0 4rem" }}>
          <ProgressBar currentCount={4} totalCount={4} width="6.4rem" />
        </div>
      )}
    </>
  );
}

const DiffTable = ({
  editedData,
  userData,
}: {
  editedData: MemberPublicEditing;
  userData: MemberPublic;
}) => {
  return (
    <div className="diff-table">
      {editedData.name && (
        <>
          <div>
            <strong>Name</strong>
          </div>
          <div>
            <span>{userData.name}</span>
            <span>{editedData.name}</span>
          </div>
        </>
      )}
      {editedData.location && (
        <>
          <div>
            <strong>Location</strong>
          </div>
          <div>
            <span>{`${userData.location}, ${userData.region}`}</span>
            <span>{editedData.location}</span>
          </div>
        </>
      )}
      {editedData.link && (
        <>
          <div>
            <strong>Website</strong>
          </div>
          <div>
            <span>{userData.link}</span>
            <span>{editedData.link}</span>
          </div>
        </>
      )}
      {editedData.focus && (
        <>
          <div>
            <strong>Field of Work</strong>
          </div>
          <div>
            <span>
              {userData.focus?.length
                ? `${userData.focus?.length} focus${
                    (userData?.focus?.length > 1 ||
                      userData?.focus?.length === 0) &&
                    "es"
                  }`
                : "None"}
            </span>
            <span>
              {[...editedData.focus, editedData.focusSuggested].filter(
                (foc) => !!!foc,
              ).length > 0 && <>Updated</>}
            </span>
          </div>
        </>
      )}
      {editedData.title || editedData.title === "" ? (
        <>
          <div>
            <strong>Title</strong>
          </div>
          <div>
            <span>{userData.title}</span>
            <span>
              {editedData.title === "" ? <em>No title</em> : editedData.title}
            </span>
          </div>
        </>
      ) : (
        <></>
      )}
      {editedData.industry && (
        <>
          <div>
            <strong>Industry</strong>
          </div>
          <div>
            <span>
              {userData.industry?.length
                ? `${userData.industry.length} industr`
                : "None"}
              {userData.industry?.length > 1 || userData.industry?.length === 0
                ? "ies"
                : userData.industry?.length
                ? "y"
                : ""}
            </span>
            <span>
              {[...editedData.industry, editedData.industrySuggested].filter(
                (foc) => !!!foc,
              ).length > 0 && <>Updated</>}
            </span>
          </div>
        </>
      )}
      {editedData.companySize && (
        <>
          <div>
            <strong>Company Size</strong>
          </div>
          <div>
            <span>{userData.companySize ? userData.companySize : "None"}</span>
            <span>{editedData.companySize}</span>
          </div>
        </>
      )}
      {editedData.yearsExperience && (
        <>
          <div>
            <strong>Years Experience</strong>
          </div>
          <div>
            <span>
              {userData.yearsExperience ? userData.yearsExperience : "None"}
            </span>
            <span>{editedData.yearsExperience}</span>
          </div>
        </>
      )}
      <style jsx>{`
        .diff-table {
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .diff-table strong {
          display: block;
          font-size: 0.875rem;
          margin: 1rem 0 0.25rem;
        }
        .diff-table span {
          display: inline-block;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          margin-right: 0.5rem;
          padding: 0.125rem 0.5rem;
          border-radius: ${theme.borderRadius.xs};
        }
        .diff-table div span:nth-child(odd) {
          background: rgba(179, 39, 25, 0.2);
          color: rgba(179, 39, 25, 0.5);
          text-decoration: line-through;
        }
        .diff-table div span:nth-child(even) {
          background: rgba(186, 218, 85, 0.35);
          color: rgb(91, 113, 23);
        }
      `}</style>
    </div>
  );
};
