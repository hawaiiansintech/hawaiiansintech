# Hawaiians in Tech

The website is built using [Airtable](https://airtable.com/), [Next.js](https://nextjs.org/) and deployed at [Vercel](https://vercel.com/).

## Development

The code was forked from [Brazillians who Design](https://brazilianswho.design/). The following instructions should help you running on your local machine to get started.

### Install the dependencies

Making sure you're in the correct project folder and install the dependencies:

```
yarn install
```

### Run the project locally

To start the development server run:

```
yarn dev
```

In your browser, open `localhost:3000`.

## Airtable Access

If you are looking to access the Airtable data, please reach out to our Hawaiians In Tech website development team on our [Discord](https://discord.gg/p7338Z5MJQ).

You can also load mock data in `index.tsx` by updating the import statement to `"@/lib/stubApi"`

```javascript
import {
  Focus,
  getFocuses,
  getIndustries,
  getMembers,
  Industry,
  MemberPublic,
} from "@/lib/api";
/* 🔺🔺🔺🔺🔺🔺🔺 */
```

### Deploy at vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https%3A%2F%2Fgithub.com%2Fhawaiians%2Fhawaiiansintech)

### Useful VS Code extensions

The following are a few useful VS Code extensions that may help during development:

- `prettier`
- `eslint`
- `beautify`
- `vscode-styled-components`
