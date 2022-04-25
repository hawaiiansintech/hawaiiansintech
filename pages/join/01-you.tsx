import Button, { ButtonSize } from "@/components/Button";
import Input from "@/components/form/Input";
import ProgressBar from "@/components/form/ProgressBar";
import Selectable from "@/components/form/Selectable";
import UndoButton from "@/components/form/UndoButton";
import { Heading, Subheading } from "@/components/Heading";
import MetaTags from "@/components/Metatags.js";
import { MemberPublic } from "@/lib/api";
import { useStorage } from "@/lib/hooks";
import { Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import theme from "styles/theme";
import urlRegex from "url-regex";
import * as Yup from "yup";
import JoinHeader from "./components/join-header";

const ALL_STORED_FIELDS = [
  "jfName",
  "jfLocation",
  "jfWebsite",
  "jfFocuses",
  "jfFocusSuggested",
  "jfTitle",
  "jfDeferTitle",
  "jfYearsExperience",
  "jfIndustries",
  "jfDeferIndustry",
  "jfIndustrySuggested",
  "jfCompanySize",
];

const NEXT_PAGE = "02-work";

export const clearAllStoredFields = () => {
  const { removeItem } = useStorage();
  ALL_STORED_FIELDS.map((item) => removeItem(item));
};

export default function JoinStep1(props) {
  const router = useRouter();
  const { r } = router.query;
  const { getItem, setItem } = useStorage();
  const [showEdit, setEditIsShowing] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);

  // clear fields if param `r` is present
  useEffect(() => {
    if (r) {
      clearAllStoredFields();
      setName("");
      setLocation("");
      setWebsite("");
      if (typeof window !== "undefined")
        window.history.replaceState(null, "", "/join/01-you");
    }
    console.log(`r`, r);
  }, [r]);

  useEffect(() => {
    let storedName = getItem("jfName");
    let storedLocation = getItem("jfLocation");
    let storedWebsite = getItem("jfWebsite");
    if (storedName) setName(storedName);
    if (storedLocation) setLocation(storedLocation);
    if (storedWebsite) setWebsite(storedWebsite);
  }, []);

  const renderButton = () => {
    if (name || location || website)
      return (
        // TODO remove this hardcoded css
        <div
          style={{
            border: `0.125rem solid ${theme.color.border.base}`,
            borderRadius: theme.borderRadius.sm,
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            color: theme.color.text.alt2,
          }}
        >
          <UndoButton
            onClick={() => {
              setName("");
              setLocation("");
              setWebsite("");
              clearAllStoredFields();
            }}
          >
            Clear form
          </UndoButton>
        </div>
      );
  };

  const handleToggle = () => {
    setEditIsShowing(!showEdit);
  };

  return (
    <>
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <JoinHeader hideCenter={showEdit} showModify toggleEdit={handleToggle}>
        <ProgressBar
          headline="Public"
          label="Who You Are"
          currentCount={1}
          totalCount={4}
        />
      </JoinHeader>
      {showEdit ? (
        <EditPicker />
      ) : (
        <>
          <div className="container">
            <>
              <Heading>Welcome to our little hui.</Heading>
              <Subheading centered>
                To join the directory, we just ask that you are{" "}
                <strong>Native Hawaiian</strong> and work in the{" "}
                <strong>field / industry of technology</strong>.
              </Subheading>
              <section
                style={{
                  margin: "2rem auto 0",
                  maxWidth: theme.layout.width.interior,
                }}
              >
                {renderButton()}

                <Formik
                  enableReinitialize
                  initialValues={{
                    name: name,
                    location: location,
                    website: website,
                  }}
                  validateOnBlur={validateAfterSubmit}
                  validateOnChange={validateAfterSubmit}
                  validate={() => setValidateAfterSubmit(true)}
                  onSubmit={(values) => {
                    setLoading(true);
                    setItem("jfName", values.name);
                    setItem("jfLocation", values.location);
                    setItem("jfWebsite", values.website);
                    router.push({ pathname: NEXT_PAGE });
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required(
                      "We need to know what to call you. Name is required."
                    ),
                    location: Yup.string().required(
                      "A location, imprecise or not, is required."
                    ),
                    website: Yup.string()
                      .matches(
                        urlRegex({ strict: false }),
                        "That URL looks funny. Please try again."
                      )
                      .required(
                        "A website is required; think about a place where people can learn more about you."
                      ),
                  })}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <div style={{ marginBottom: "2rem" }}>
                        <Input
                          name="name"
                          label="What’s your name?"
                          value={props.values.name}
                          labelTranslation="ʻO wai kou inoa?"
                          placeholder="Full name"
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          error={props.touched.name && props.errors.name}
                        />
                      </div>
                      <div style={{ marginBottom: "2rem" }}>
                        <Input
                          name="location"
                          value={props.values.location}
                          label="Where you stay now days?"
                          labelTranslation="Ma hea ʻoe e noho ʻana?"
                          placeholder="Island/City, State"
                          onBlur={props.handleBlur}
                          onChange={props.handleChange}
                          error={
                            props.touched.location && props.errors.location
                          }
                        />
                      </div>
                      <Input
                        name="website"
                        value={props.values.website}
                        label="What’s your LinkedIn / professional website?"
                        labelTranslation="He aha kou wahi uila ’oihana?"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        error={props.touched.website && props.errors.website}
                      />

                      <div style={{ margin: "2rem auto 0", maxWidth: "24rem" }}>
                        <Button fullWidth loading={loading} type="submit">
                          Continue
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </section>
            </>
          </div>
        </>
      )}
    </>
  );
}

function EditPicker() {
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [memberSelected, setMemberSelected] = useState<MemberPublic>();

  useEffect(() => {
    fetch("/api/get-members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members);
      });
  }, []);

  return (
    <div
      className="edit-picker"
      style={{
        margin: "0 auto 1rem",
        maxWidth: theme.layout.width.interior,
      }}
    >
      <h1>Request Changes</h1>
      {/* <h3>We'll try reach out to the email we have down for you.</h3>
      <h4>
        <strong>Any issues?</strong> Just add any details or loose change to
        this field and we'll work it out.
      </h4> */}
      <label htmlFor="member-select">Request edit for:</label>
      <select
        name="member-select"
        id="member-select"
        onChange={(e) => {
          console.log(members.find((member) => member.id === e.target.value));
          setMemberSelected(
            members.find((member) => member.id === e.target.value)
          );
        }}
      >
        {members?.length > 0 ? (
          <option value="">Please choose an option</option>
        ) : (
          <option value="">loading</option>
        )}
        {members?.map((member: MemberPublic) => {
          return (
            <option value={member.id} key={`member-${member.id}`}>
              {member.name}
            </option>
          );
        })}
      </select>
      {memberSelected && (
        <>
          <h4>
            I would like to <strong>update / change</strong>:
          </h4>
          <div
            style={{
              display: "grid",
              gridAutoRows: "4rem",
              gridColumnGap: "0.5rem",
              gridRowGap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <Selectable
              headline={"Basic Information"}
              byline={`${
                (memberSelected.name ? 1 : 0) +
                (memberSelected.location ? 1 : 0) +
                (memberSelected.link ? 1 : 0)
              } / 3 Completed`}
              fullWidth
            />
            <Selectable
              headline={`Work Experience`}
              byline={`${
                (memberSelected.focus ? 1 : 0) +
                (memberSelected.title ? 1 : 0) +
                (memberSelected.yearsExperience ? 1 : 0)
              } / 3 Completed`}
              fullWidth
            />
            <Selectable
              headline={`Company / Industry`}
              byline={`${
                (memberSelected.industry ? 1 : 0) +
                (memberSelected.companySize ? 1 : 0)
              } / 2 Completed`}
              fullWidth
            />
          </div>

          <Button size={ButtonSize.Small}>Continue</Button>
          <a>Remove me from this list</a>
        </>
      )}
      <style jsx>{`
        .edit-picker {
          z-index: ${theme.layout.zIndex.above};
        }
        h1 {
          margin: 0 0 1rem;
          font-size: 2.4rem;
        }
        h3 {
          margin: 2rem 0 0.5rem;
          font-size: 1.6rem;
          font-weight: 400;
          color: ${theme.color.text.alt};
        }
        h4 {
          margin: 1rem 0 0.5rem;
          font-size: 1.2rem;
          font-weight: 400;
        }
        label {
          margin: 0 0.5rem 0 0;
          white-space: nowrap;
          font-size: 1.5rem;
          color: ${theme.color.text.alt};
        }
        select {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
