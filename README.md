# Fuzevalo Catalog

Fuzevalo is a Next.js storefront mockup for browsing and managing gaming accounts. It includes a public catalog, account detail pages, and a simple admin catalog view backed by in-memory mock data.

## Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Bun
- Vitest

## Main Routes

- `/` storefront landing page and catalog
- `/catalog/[id]` account detail page
- `/admin` admin catalog page

## Local Development

Install dependencies:

```bash
bun install
```

Start the app:

```bash
bun run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run typecheck
bun run test
```

## Project Structure

```text
src/app
src/features/catalog
src/features/storefront
src/features/admin-catalog
```

- `src/features/catalog` domain, application, and mock repository logic
- `src/features/storefront` public storefront UI
- `src/features/admin-catalog` admin catalog management UI

## Data Source

Catalog data currently comes from the in-memory mock repository:

- [src/features/catalog/infrastructure/mock-products.ts](/Users/zii/Projects/jiratech/fuze-gaming-catalog/src/features/catalog/infrastructure/mock-products.ts:1)
- [src/features/catalog/infrastructure/in-memory-product-repository.ts](/Users/zii/Projects/jiratech/fuze-gaming-catalog/src/features/catalog/infrastructure/in-memory-product-repository.ts:1)

This means product edits are not persisted beyond code changes.

## Product Detail Notes

The current account detail page includes:

- responsive gallery and description layout
- desktop tab switching for `Description`, `Skins`, and `Heroes`
- mobile arrow-based content navigation
- themed price/status CTA area
- mock skin list and account detail content driven by product data

The current product model does not yet include a true hero-name roster, so the `Heroes` view shows unlock-related account details rather than a full named hero list.

## Verification

Before opening a PR, at minimum run:

```bash
bun run typecheck
```

If you changed UI behavior or business logic, also run:

```bash
bun run lint
bun run test
```
