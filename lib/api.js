import airtable from 'airtable';

export async function fetchAPI() {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_KEY
  });
  const results = await airtable.base(process.env.AIRTABLE_BASE)(process.env.AIRTABLE_TABLE).select({
    view: 'Grid view'
  }).all();

  const sanitizedResults = results
    .filter(member => !member.fields['Exclude'] && member.fields['Name'])
    .map(member => {
      return {
        name: member.fields['Name'],
        location: member.fields['Location'],
        region: member.fields['Region'],
        role: member.fields['Role'],
        link: member.fields['Link'],
      }
    })

  return sanitizedResults;
}