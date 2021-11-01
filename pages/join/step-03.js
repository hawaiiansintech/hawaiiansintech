import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
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
      roles,
    },
    revalidate: 60,
  };
}

export default function JoinStep3({ roles }) {
  const router = useRouter();
  const { name, location, email, website } = router.query;
  const [countShown, setCountShown] = useState(9);
  const [showExpand, setShowExpand] = useState(true);

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
      <div
        style={{
          margin: "2rem auto 0",
          maxWidth: "42rem",
        }}
      >
        <SearchBar dictionary={roles} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: "1fr",
          columnGap: "0.5rem",
          rowGap: "0.5rem",
          maxWidth: "42rem",
          margin: "2rem auto 0",
        }}
      >
        {roles.slice(0, countShown).map((role, i) => {
          return (
            <RadioBox
              label={role.name}
              seriesOf="professional-focus"
              small
              horizontal
              border
              key={`role-${i}`}
            />
          );
        })}
        {showExpand || (
          <ButtonBox
            label="None of these fit; suggest another"
            seriesOf="professional-focus"
            small
            horizontal
            border
          />
        )}
      </div>
      {showExpand && (
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
