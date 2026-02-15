# ESLint & Prettier Setup

This project includes a comprehensive linting setup that integrates ESLint, TypeScript, and Prettier seamlessly.

## 🚀 **Available Scripts**

### Core Commands

```bash
# Lint your code (will show warnings but won't fail)
pnpm run lint

# Auto-fix many linting issues
pnpm run lint:fix

# Type checking (must pass for production)
pnpm run type-check

# Format code with Prettier
pnpm run format

# Check if code is properly formatted (doesn't modify files)
pnpm run format:check

# Run all checks (type checking, linting, and format checking)
pnpm run check
```

### Quick Fixes

```bash
# Fix formatting issues
pnpm run format

# Fix auto-fixable ESLint issues
pnpm run lint:fix
```

## 🔧 **What the Linting Catches**

### ✅ **Critical Issues (Now Fixed)**

- Type mismatches
- Undefined variables and functions
- Incorrect method calls
- Unused variables and imports
- React Hook violations
- Basic code quality issues

### ⚠️ **Current Warnings (Code Quality)**

- Missing `alt` attributes on images
- Missing dependencies in `useEffect` hooks
- Using `<img>` instead of Next.js `<Image />` component
- `any` types in TypeScript
- Empty interfaces

## 🏗️ **Configuration Files**

### `.eslintrc.js`

- **Next.js Integration**: Uses `next/core-web-vitals` and `next/typescript`
- **TypeScript Support**: Full TypeScript ESLint integration
- **Prettier Integration**: No formatting conflicts
- **React Hooks**: Proper hook dependency checking

### `.prettierrc`

- **Tailwind Integration**: `prettier-plugin-tailwindcss`
- **Import Organization**: `prettier-plugin-organize-imports`
- **Consistent Formatting**: 2-space tabs, 80 char width

### `tsconfig.json`

- **Strict Mode**: Currently disabled for migration (TODO: enable)
- **Path Aliases**: Clean import paths with `@/` prefix
- **Next.js Optimized**: Built for Next.js 15

## 🛠️ **Troubleshooting**

### **If you see linting errors:**

1. **Run auto-fix**: `pnpm run lint:fix`
2. **Format code**: `pnpm run format`
3. **Check types**: `pnpm run type-check`

### **Common Issues:**

- **Prettier conflicts**: Run `pnpm run format` first
- **Type errors**: Check `pnpm run type-check`
- **Hook warnings**: Review `useEffect` dependencies

## 🏆 **Best Practices**

1. **Run linting regularly**: Use `pnpm run lint` during development
2. **Fix warnings early**: Don't let them accumulate
3. **Use auto-fix**: Run `pnpm run lint:fix` to automatically fix issues
4. **Check types**: Run `pnpm run type-check` before major changes
5. **Format code**: Use `pnpm run format` to maintain consistent formatting
6. **Run all checks**: Use `pnpm run check` before committing
7. **Commit hooks**: Consider adding pre-commit hooks for automatic formatting

## 🔄 **GitHub Actions Integration**

This project includes GitHub Actions that automatically run quality checks on every pull request to the `main` branch:

- **Type Checking**: Ensures TypeScript types are correct (`pnpm run type-check`)
- **ESLint**: Checks code quality and enforces coding standards (`pnpm run lint`)
- **Format Checking**: Verifies code is properly formatted with Prettier (`pnpm run format:check`)

**Note**: The build check is currently disabled due to Firebase dependencies in `getStaticProps` that require real credentials. This will be re-enabled once mock data is properly implemented for CI environments.

All checks must pass before a pull request can be merged. If any check fails:

1. **Formatting Issues**: Run `pnpm run format` to fix automatically
2. **Lint Issues**: Run `pnpm run lint:fix` for auto-fixable issues
3. **Type Issues**: Fix TypeScript errors manually

You can run the same checks locally with `pnpm run check` before pushing.

## 📈 **Performance Impact**

- **Build Time**: Minimal impact (ESLint runs in parallel)
- **Development**: Real-time feedback in your editor
- **Production**: Zero impact (linting only runs during build/dev)
