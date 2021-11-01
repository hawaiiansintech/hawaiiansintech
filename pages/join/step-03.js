import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { toKebab } from "../../helpers.js";
import MetaTags from "../../components/Metatags.js";
import Header from "../../components/Header.js";
import Button from "../../components/Button.js";
import RadioBox from "../../components/form/RadioBox.js";
import Disclaimer from "../../components/form/Disclaimer.js";
import SearchBar from "../../components/form/SearchBar.js";
import { fetchRoles } from "../../lib/api";
import ButtonBox from "../../components/form/ButtonBox.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export async function getStaticProps() {
  let roles = (await fetchRoles()) ?? [];
  roles = roles.sort((a, b) => {
    return b.count - a.count;
  });
  return {
    props: {
      rolesData: roles,
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ rolesData }) {
  const router = useRouter();
  const { name, location, email, website } = router.query;
  const [countShown, setCountShown] = useState(9);
  const [showExpand, setShowExpand] = useState(true);
  const [roles, setRoles] = useState(rolesData);
  const [roleSelected, selectRole] = useState();
  const [hasSearchResults, setHasSearchResults] = useState(false);

  const handleSelect = (role) => {
    selectRole(role);
  };
  const handleUpdate = (roles) => {
    console.log(roles);
  };

  return (
    <div className="container">
      <Head>
        <title>Hawaiians in Technology | Join</title>
        <link rel="icon" href="/favicon.ico" />
        <MetaTags />
      </Head>
      <Link href="/" shallow={true}>
        <a className="auxNav arrowback">←</a>
      </Link>
      <Header>
        <h2>Us techie Hawaiians stay talented.</h2>
      </Header>
      {name} {location} {email} {website}
      {roleSelected ? (
        <>{roleSelected.name}</>
      ) : (
        <>
          <div
            style={{
              margin: "2rem auto 0",
              maxWidth: "42rem",
            }}
          >
            <SearchBar
              dictionary={roles}
              handleUpdate={(results) => {
                setHasSearchResults(results.length > 0);
              }}
              handleSelect={(role) => {
                selectRole(role);
              }}
            />
          </div>
          {hasSearchResults || (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridAutoRows: "1fr",
                columnGap: "0.5rem",
                rowGap: "0.5rem",
                maxWidth: "42rem",
                margin: "1rem auto 0",
              }}
            >
              {roles.slice(0, countShown).map((role, i) => {
                return (
                  <ButtonBox
                    label={role.name}
                    onClick={() => {
                      handleSelect(role);
                    }}
                    key={`ButtonBox-${i}-`}
                  />
                );
              })}
            </div>
          )}
          {showExpand || (
            <ButtonBox label="None of these fit; suggest another" border />
          )}
          {showExpand && !hasSearchResults && (
            <div style={{ marginTop: "2rem" }}>
              <button
                className="more-link"
                onClick={() => {
                  setCountShown(roles.length);
                  setShowExpand(false);
                }}
              >
                More Options
              </button>
            </div>
          )}
        </>
      )}
      <div style={{ marginTop: "2rem" }}>
        <Button>Submit</Button>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Disclaimer>
          Sharing your professional focus will help the community understand the
          breadth of kanaka expertise in technology.
        </Disclaimer>
      </div>
      <style global jsx>{`
        .container {
          padding-top: 6rem;
        }
        .more-link {
          ${cssHelperButtonReset}
          background: transparent;
          color: var(--color-brand);
          font-weight: 500;
        }
        .more-link:hover {
          color: var(--color-brand-tone);
        }
      `}</style>
    </div>
  );
}
