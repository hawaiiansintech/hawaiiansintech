import airtable from "airtable";

export async function fetchTechnologists() {
  airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_KEY,
  });

  const technologists = await airtable
    .base(process.env.AIRTABLE_BASE)("Members")
    .select({
      view: "Grid view",
    })
    .all();

  const regions = await airtable
    .base(process.env.AIRTABLE_BASE)("Regions")
    .select({
      view: "Grid view",
    })
    .all();

  const roles = await airtable
    .base(process.env.AIRTABLE_BASE)("Roles")
    .select({
      view: "Grid view",
    })
    .all();

  const sanitizedResults = technologists
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

  return sanitizedResults;
}

export async function fetchRoles() {
  airtable.configure({
    endpointUrl: "https://api.airtable.com",
    apiKey: process.env.AIRTABLE_KEY,
  });

  const roles = await airtable
    .base(process.env.AIRTABLE_BASE)("Roles")
    .select({
      view: "Grid view",
    })
    .all();

  const sanitizedResults = roles
    .filter((role) => role.fields["Members"]?.length > 0 && role.fields["Name"])
    .map((role) => {
      if (role.fields["Members"] === undefined) return;
      return {
        name: role.fields["Name"],
        members: role.fields["Members"],
        count: role.fields["Members"]?.length,
      };
    });

  return sanitizedResults;
}
