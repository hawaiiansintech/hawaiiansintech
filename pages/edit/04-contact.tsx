import Button from "@/components/Button";
import ErrorMessage, {
  ErrorMessageProps,
} from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import { Heading, Subheading } from "@/components/Heading";
import JoinHeader from "@/components/intake-form/JoinHeader";
import MetaTags from "@/components/Metatags.js";
import { MemberPublic, MemberPublicEditing } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import * as Yup from "yup";

export default function JoinStep4() {
  const router = useRouter();
  const { getItem, setItem, removeItem } = useStorage();
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
      router.push({ pathname: "thank-you" });
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
        <title>Hawaiians in Technology | Request Changes</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader backUrl="03-company" />
      <div className="container">
        <Heading>Requesting changes for {userData.name}</Heading>
        {userData.emailAbbr && (
          <Subheading centered>
            We'll take a look, then confirm any changes with you at{" "}
            <strong>{`${userData.emailAbbr[0]}...${userData.emailAbbr[1]}${userData.emailAbbr[2]}`}</strong>
            . Mahalo for your patience!
          </Subheading>
        )}
        <section
          style={{
            margin: "2rem auto 0",
            maxWidth: theme.layout.width.interior,
          }}
        >
          {error && (
            <div style={{ marginBottom: "1rem" }}>
              <ErrorMessage headline={error.headline} body={error.body} />
            </div>
          )}
          <DiffTable userData={userData} editedData={editedData} />

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
                  label="Any issues? Anything else?"
                  labelTranslation="He aha nā mea a pau?"
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
        </section>
      </div>
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
            <strong>Focus</strong>
          </div>
          <div>
            <span>
              {userData.focus?.length
                ? `${userData.focus.length} focus`
                : "None"}
              {(userData?.focus?.length > 1 || userData?.focus?.length === 0) &&
                "es"}
            </span>
            <span>
              {[...editedData.focus, editedData.focusSuggested].length
                ? `${
                    [...editedData.focus, editedData.focusSuggested].length
                      ? "1"
                      : "0"
                  } focus${
                    [...editedData.focus, editedData.focusSuggested].length > 1
                      ? "es"
                      : ""
                  }`
                : "New focus"}
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
              {userData.industry?.length ? userData.industry.length : "None"}
              {userData.industry?.length > 1 || userData.industry?.length === 0
                ? "ies"
                : userData.industry?.length
                ? "y"
                : ""}
            </span>
            <span>
              {[...editedData.industry, editedData.industrySuggested].length}{" "}
              industr
              {[...editedData.industry, editedData.industrySuggested].length >
                1 ||
              [...editedData.industry, editedData.industrySuggested].length ===
                0
                ? "ies"
                : "y"}
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
