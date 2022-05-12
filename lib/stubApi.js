/**
 * Stubbed function to simulate fetching technologists
 * without connecting to airtable.
 * 
 * @returns stubbed values
 */
export async function fetchTechnologists() {
  return [
    {
      name: "Andrew Taeoalii",
      location: "Hawaii",
      region: "USA",
      role: "Software Engineer",
      link: "https://linkedin.com/in/andrewtaeoalii"
    },
    {
      name: "Emmit Kamakani Parubrub",
      location: "San Francisco",
      region: "California",
      role: "Software Engineer",
      link: "https://linkedin.com/in/emmitparubrub"
    },
    {
      name: "Taylor Ho",
      location: "San Francisco",
      region: "California",
      role: "UX Designer",
      link: "https://linkedin.com/in/taylorho"
    },
    {
      name: "Tianna Johnson",
      location: "San Francisco",
      region: "California",
      role: "Talent Acquisition",
      link: "https://linkedin.com/in/tiannajohnson"
    }
  ]
}

/**
 * Stubbed function to fetch roles without connecting to airtable.
 * 
 * @returns stubbed roles
 */
export async function fetchRoles() {
  return [
    {
      name: "Software Engineer",
      members: ["Andrew Taeoalii", "Emmit Kamakani Parubrub"],
      count: 2
    },
    {
      name: "Talent Acquisition",
      members: ["Tianna Johnson"],
      count: 1
    },
    {
      name: "UX Designer",
      members: ["Taylor Ho"],
      count: 1
    }
  ]
}
