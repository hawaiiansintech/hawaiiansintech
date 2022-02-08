import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

interface BaseProps {
  name: "Members" | "Regions" | "Roles" | "Focuses" | "Industries";
  view?: string;
}

const getBase = async ({ name, view }: BaseProps) => {
  return airtable
    .base(process.env.AIRTABLE_BASE_NEW)(name)
    .select({
      view: view || "All",
    })
    .all();
};

export async function getMembers() {
  return Promise.all([
    getBase({ name: "Members", view: "Approved" }),
    getBase({ name: "Focuses", view: "Approved" }),
    getBase({ name: "Regions" }),
  ]).then((values) => {
    const [members, focuses, regions] = values;
    return members.map((member) => {
      const regionLookup =
        regions.find((region) => {
          const memberRegion = member.fields["Region"];
          if (memberRegion && Array.isArray(memberRegion)) {
            return region.id === member.fields["Region"][0];
          }
        })?.fields["Name"] || null;

      const focusLookup = () => {
        const memberFocus = member.fields["Focus"];
        if (memberFocus && Array.isArray(memberFocus)) {
          return memberFocus.map((foc) => {
            return (
              focuses
                .filter((thisFoc) => foc === thisFoc.id)
                .map((foc) => {
                  return {
                    name: foc.fields["Name"],
                    id: foc.fields["ID"],
                  };
                })[0] || null
            );
          });
        }
      };

      return {
        name: member.fields["Name"] || null,
        location: member.fields["Location"] || null,
        link: member.fields["Link"] || null,
        title: member.fields["Title"] || null,
        region: regionLookup,
        focus: focusLookup(),
      };
    });
  });
}

export async function getFocuses() {
  const focuses = await getBase({ name: "Focuses", view: "Approved" });

  return focuses
    .filter((role) => role.fields["Name"])
    .map((role) => {
      return {
        name: role.fields["Name"],
        id: role.fields["ID"],
        members: role.fields["Members"] ? role.fields["Members"] : null,
        count: Array.isArray(role.fields["Members"])
          ? role.fields["Members"].length
          : 0,
      };
    });
}

export async function getIndustries() {
  const industries = await getBase({ name: "Industries", view: "Approved" });

  return industries
    .filter((role) => role.fields["Name"])
    .map((role) => {
      return {
        name: role.fields["Name"],
        id: role.fields["ID"],
        members: role.fields["Members"] ? role.fields["Members"] : null,
        count: Array.isArray(role.fields["Members"])
          ? role.fields["Members"].length
          : 0,
      };
    });
}
