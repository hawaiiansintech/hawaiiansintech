import FilterPicker, { PickerFilter } from "@/components/filters/FilterPicker";
import MemberDirectory, { DirectoryMember } from "@/components/MemberDirectory";
import MetaTags from "@/components/Metatags";
import Nav from "@/components/Nav";
import { Title } from "@/components/Title.js";
// Change to "@/lib/stubApi" if no access to airtable vars!
import { Filter, getFilters, getMembers, MemberPublic } from "@/lib/api";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import theme from "styles/theme";

export async function getStaticProps() {
  const members: MemberPublic[] = await getMembers();
  const focuses: Filter[] = await getFilters(
    "focus",
    true,
    members.map((member) => member.id)
  );
  const industries: Filter[] = await getFilters(
    "industry",
    true,
    members.map((member) => member.id)
  );
  return {
    props: {
      fetchedMembers: members,
      fetchedFocuses: focuses,
      fetchedIndustries: industries,
      pageTitle: "Hawaiians in Tech",
    },
    revalidate: 60,
  };
}

export default function HomePage({
  fetchedMembers,
  fetchedFocuses,
  fetchedIndustries,
  pageTitle,
}) {
  const initialState = {
    members: fetchedMembers.map((mem) => ({
      ...mem,
      // mutate & add active prop
      focus: mem.focus
        ? mem.focus.map((foc) => ({ ...foc, active: false }))
        : [],
      industry: mem.industry
        ? mem.industry.map((ind) => ({ ...ind, active: false }))
        : [],
    })),
    focuses: fetchedFocuses.filter((focus) => focus.count > 0),
    industries: fetchedIndustries.filter((industry) => industry.count > 0),
  };
  const [members, setMembers] = useState<DirectoryMember[]>(
    initialState.members
  );
  const [activeFilters, setActiveFilters] = useState<PickerFilter[]>([]);
  const [filtersList, setFiltersList] = useState<PickerFilter[]>([]);
  const [focuses, setFocuses] = useState<PickerFilter[]>(initialState.focuses);
  const [industries, setIndustries] = useState<[]>(initialState.industries);
  const [membersCount, setMembersCount] = useState<number>(
    initialState.members.length
  );

  useEffect(() => {
    const activeFilters = focuses
      .concat(industries)
      .filter((foc) => foc.active);
    const membersWithFocuses = members
      .map((mem) => ({
        ...mem,
        focus: mem.focus?.map((foc) => ({
          ...foc,
          // update member focuses if filtered
          active: activeFilters.map((foc) => foc.id).includes(foc.id),
        })),
        industry: mem.industry?.map((ind) => ({
          ...ind,
          active: activeFilters.map((ind) => ind.id).includes(ind.id),
        })),
      }))
      // sort by number of filters set
      .sort((a, b) => {
        if (
          a.focus.concat(a.industry) === undefined ||
          b.focus.concat(b.industry) === undefined
        )
          return;
        const firstActive = a.focus
          .concat(a.industry)
          .map((fil) => fil?.active)
          .filter((fil) => fil).length;
        const nextActive = b?.focus
          .concat(b?.industry)
          .map((fil) => fil?.active)
          .filter((fil) => fil).length;
        // if same count, randomize
        if (nextActive === firstActive) return 0.5 - Math.random();
        // or sort by
        return nextActive > firstActive ? 1 : -1;
      });
    const selectedMemberCount = membersWithFocuses.filter(
      (mem) =>
        mem.focus.filter((fil) => fil.active).length > 0 ||
        mem.industry.filter((fil) => fil.active).length > 0
    ).length;
    setMembersCount(selectedMemberCount ? selectedMemberCount : members.length);
    setMembers(membersWithFocuses);
  }, [focuses, industries]);

  const setListItemActive = (
    list?: PickerFilter[],
    setList?: Function,
    id?: string
  ) => {
    setList(
      list.map((fil) => ({
        ...fil,
        active: id ? (id === fil.id ? !fil.active : fil.active) : false,
      }))
    );
  };

  const handleFilter = (id?: string, filterType?: string) => {
    let listToUpdate =
      filterType == "focus"
        ? focuses
        : filterType == "industry"
        ? industries
        : filtersList;
    let filter = listToUpdate.filter((foc) => id === foc.id)[0];
    setListItemActive(filtersList, setFiltersList, id);
    setListItemActive(focuses, setFocuses, id);
    setListItemActive(industries, setIndustries, id);
    if (filter.active) {
      setActiveFilters(activeFilters.filter((item) => item.id !== id));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filterSeclect = (filterSelect?: string, enable?: boolean) => {
    if (filterSelect == "focus") {
      enable
        ? setFiltersList(filtersList.concat(focuses))
        : setFiltersList(
            filtersList.filter((item) => item.filterType != "focus")
          );
    } else if (filterSelect == "industry") {
      enable
        ? setFiltersList(filtersList.concat(industries))
        : setFiltersList(
            filtersList.filter((item) => item.filterType != "industry")
          );
    }
  };

  return (
    <>
      <Head>
        <MetaTags title={pageTitle} />
        <title>{pageTitle}</title>
      </Head>
      <Nav primaryNav={{ show: true }} />
      <div className="home-splash">
        <Title className="m0 p0" text="Hawaiians*in&nbsp;Technology" />
      </div>
      <div>
        <aside>
          {focuses && (
            <FilterPicker
              focuses={focuses}
              filtersList={filtersList}
              activeFilters={activeFilters}
              onFilterClick={handleFilter}
              onFilterSeclect={filterSeclect}
              selectedMemberCount={membersCount}
            />
          )}
        </aside>
        <main>{members && <MemberDirectory members={members} />}</main>
      </div>
      <style jsx>{`
        .home-splash {
          margin: 0 1rem;
          padding-top: 26vh;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .home-splash {
            margin: 0 2rem;
          }
        }
        main {
          padding: 0 1rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.medium}) {
          main {
            padding: 0 1rem;
          }
        }
        aside {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 8rem 0 1rem;
          padding: 0 1rem 0.5rem;
          background: ${theme.color.background.base};
          border-bottom: 0.125rem solid ${theme.color.border.base};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          aside {
            padding: 0 2rem 1rem;
          }
        }
        h5 {
          margin: 0;
          text-align: right;
          font-size: 1.125rem;
          color: ${theme.color.text.alt2};
          font-weight: 400;
        }
        h5 strong {
          color: ${theme.color.text.alt};
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
