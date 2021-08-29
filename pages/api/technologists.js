import airtable from 'airtable';

const READONLY_API_KEY = 'keyEYOeI12qn8q0fn';

export default async (req, res) => {
  airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: READONLY_API_KEY
  });
  const base = airtable.base('appHYwN4B8fepngSf');
  const results = await base('Members').select({
    view: 'Grid view'
  }).all();

  const sanitizedResults = results
    .filter(member => !member.fields['Exclude'])
    .map(member => {
      return {
        name: member.fields['Name'],
        location: member.fields['Location'],
        region: member.fields['Region'],
        role: member.fields['Role'],
        link: member.fields['Link'],
      }
    })

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(sanitizedResults));
};
