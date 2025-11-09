# Gym Membership Sign Up

This project is a sign-up form for a gym membership.

# Getting Started

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
npx shadcn@latest add button
```

## Mock Service Worker

This project uses [Mock Service Worker (MSW)](https://mswjs.io/) to mock API requests for development and testing. The mock handlers are defined in `src/mocks/handlers.ts`.

## Project Structure

```
.
├── public
│   └── vite.svg
├── src
│   ├── components
│   │   ├── ui => Shadcn components
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── progress.tsx
│   │   ├── left-drawer.tsx
│   │   ├── progress-steps.tsx
│   │   └── step-layout.tsx
│   ├── context
│   │   └── RegistrationContext.tsx
│   ├── handlers => MSW handlers
│   │   └── handlers.ts
│   ├── lib
│   │   └── utils.ts
│   ├── routes
│   │   └── sign-up
│   │       ├── index.tsx
│   │       └── steps
│   │           ├── account.tsx
│   │           ├── address.tsx
│   │           ├── health.tsx
│   │           ├── membership-plan.tsx
│   │           ├── payment.tsx
│   │           ├── personal-info.tsx
│   │           └── review.tsx
│   ├── schemas
│   │   ├── membership-tier.ts
│   │   ├── health-condition.ts
│   │   └── registration.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── reportWebVitals.ts
│   └── styles.css
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── README.md
├── components.json
├── index.html
├── package-lock.json
├── package.json
├── prettier.config.js
├── tsconfig.json
└── vite.config.ts
```
