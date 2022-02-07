import airtable from "airtable";

airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_KEY,
});

interface BaseProps {
  name: "Members" | "Regions" | "Roles" | "Focuses" | "Industries";
  view?: "Approved" | "All";
}

const getBase = async ({ name, view }: BaseProps) => {
  return airtable
    .base(process.env.AIRTABLE_BASE)(name)
    .select({
      view: view || "All",
    })
    .all();
};

interface Focus {
  name: string;
  id: string;
}

export interface Member {
  name: string;
  location: string;
  region: string;
  link: string;
  title: string;
  focus: Focus[];
}

export default async function getMembers(req, res): Promise<Member[]> {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    Promise.all([
      getBase({ name: "Members", view: "Approved" }),
      getBase({ name: "Focuses", view: "Approved" }),
      getBase({ name: "Regions" }),
    ]).then((values) => {
      const [members, focuses, regions] = values;
      return res.status(400).json({
        members: members.map((member) => {
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
                return focuses
                  .filter((thisFoc) => foc === thisFoc.id)
                  .map((foc) => {
                    return {
                      name: foc.fields["Name"],
                      id: foc.fields["ID"],
                    };
                  })[0];
              });
            }
          };

          return {
            name: member.fields["Name"],
            location: member.fields["Location"],
            region: regionLookup,
            link: member.fields["Link"],
            title: member.fields["Title"],
            focus: focusLookup(),
          };
        }),
      });
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Gonfunnit, looks like something went wrong!",
      body: "Please try again later.",
    });
  }
}
