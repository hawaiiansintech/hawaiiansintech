import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

interface BaseProps {
  name: "Members" | "Regions" | "Roles" | "Focuses";
  view?: string;
}

const getBase = async ({ name, view }: BaseProps) => {
  return airtable
    .base(process.env.AIRTABLE_BASE)(name)
    .select({
      view: view || "All",
    })
    .all();
};

export async function fetchTechnologists() {
  const technologists = await getBase({ name: "Members" });
  const regions = await getBase({ name: "Regions" });
  const roles = await getBase({ name: "Roles" });

  return technologists
    .filter((member) => !member.fields["Exclude"] && member.fields["Name"])
    .map((member) => {
      const regionLookup = regions.find(
        (region) => region.id === member.fields["Region"][0]
      ).fields["Name"];
      const roleLookup = roles.find(
        (role) => role.id === member.fields["Role"][0]
      ).fields["Name"];

      return {
        name: member.fields["Name"],
        location: member.fields["Location"],
        region: regionLookup,
        role: roleLookup,
        link: member.fields["Link"],
      };
    });
}

export async function fetchRoles() {
  const roles = await getBase({ name: "Roles" });

  return roles
    .filter((role) => role.fields["Members"] && role.fields["Name"])
    .map((role) => {
      if (role.fields["Members"] === undefined) return;
      return {
        name: role.fields["Name"],
        id: role.fields["ID"],
        members: role.fields["Members"],
        count: Array.isArray(role.fields["Members"])
          ? role.fields["Members"].length
          : 0,
      };
    });
}

export async function fetchFocuses() {
  const focuses = await getBase({ name: "Focuses" });

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
