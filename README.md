# Hawaiians in Tech

The website is built using [Firebase](https://console.firebase.google.com/), [Next.js](https://nextjs.org/) and deployed at [Vercel](https://vercel.com/).

## Development

The code was forked from [Brazillians who Design](https://brazilianswho.design/). The following instructions should help you running on your local machine to get started.

### Install the dependencies

Making sure you're in the correct project folder and install the dependencies:

```
pnpm install
```

### Run the project locally

To start the development server with mock data run:

```
pnpm dev
```

This sets `NODE_ENV=development` and uses mock user data for local development.

To start the server with real Firebase data run:

```
pnpm test
```

This sets `NODE_ENV=test` and connects to the actual Firebase database.

To start the email templating server run:

```
pnpm dev:email
```

In your browser, open `localhost:3000`.

### Code Quality

This project includes linting that integrates ESLint, TypeScript, and Prettier:

```bash
# Lint your code (shows warnings but won't fail)
pnpm run lint

# Auto-fix many linting issues
pnpm run lint:fix

# Type checking (must pass for production)
pnpm run type-check

# Format code with Prettier
pnpm run format

# Run both type checking and linting
pnpm run check
```

See [LINTING.md](./LINTING.md) for detailed information about the linting setup.

## Testing

This project uses Jest for unit testing, particularly focused on API endpoint testing with comprehensive mocking for Firebase and external dependencies.

### Test Commands

```bash
# Run all tests
pnpm run test:unit

# Run tests in watch mode (auto-reruns on file changes)
pnpm run test:unit:watch

# Run tests with coverage report
pnpm run test:unit:coverage

# Run specific test file
pnpm run test:unit tests/api/is-admin.test.ts
```

## Firebase Access

If you are looking to access the Firebase data, please reach out to our Hawaiians In Tech website development team on our [Discord](https://discord.gg/p7338Z5MJQ).

**Note:** You no longer need to manually switch imports to use mock data. The application automatically uses mock data when running in development mode (`pnpm dev`) and real Firebase data when running in test mode (`pnpm test` with Firebase access).

### Deploy at vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https%3A%2F%2Fgithub.com%2Fhawaiians%2Fhawaiiansintech)

### Useful VS Code extensions

The following are a few useful VS Code extensions that may help during development:

- `prettier`
- `eslint`
- `beautify`
- `vscode-styled-components`
