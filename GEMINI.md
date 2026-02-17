# Gemini Workspace Context: FitLab

This document provides context for the FitLab monorepo, which includes a web application and its corresponding marketing website.

## Project Overview

FitLab is a fitness tracking application designed to help users monitor their physical and mental progress. The project is structured as an Nx monorepo and utilizes Firebase for its backend services.

The monorepo contains two main projects:

1.  `web-frontend`: The core application, built with React, Vite, and TypeScript. It allows users to log various metrics, including body measurements, mood, and progress photos. It uses Zustand for state management, React Router for navigation, and i18next for internationalization. The application is deployed on Firebase Hosting.
2.  `website`: A Next.js-based marketing and information website for the FitLab application.

### Key Technologies

*   **Monorepo:** Nx
*   **Frontend App (`web-frontend`):** React, Vite, TypeScript, SCSS, Zustand, React Router, i18next
*   **Website (`website`):** Next.js, React, TypeScript
*   **Backend & Services:** Firebase (Firestore, Storage, Hosting)
*   **Styling:** Tailwind CSS, SCSS, PostCSS
*   **Testing:** Vitest, React Testing Library, Playwright for E2E tests
*   **Linting & Formatting:** ESLint, Prettier

## Development

All commands should be run from the root of the monorepo. The workspace is managed by Nx, which handles tasks like serving, building, and testing the individual projects.

### Running the Application

*   **Run the Web Frontend (dev mode):**
    ```bash
    npx nx serve web-frontend
    ```

*   **Run the Website (dev mode):**
    ```bash
    npx nx dev website
    ```

### Building

*   **Build the Web Frontend for production:**
    ```bash
    npx nx build web-frontend
    ```
    The output is generated in `dist/web-frontend`, which is the public directory for Firebase Hosting.

*   **Build the Website for production:**
    ```bash
    npx nx build website
    ```
    The output is generated in `dist/website`.

### Testing

*   **Run unit tests for the Web Frontend:**
    ```bash
    npx nx test web-frontend
    ```

*   **Run E2E tests for the Web Frontend:**
    ```bash
    npx nx e2e web-frontend
    ```

### Linting

*   **Lint the Web Frontend:**
    ```bash
    npx nx lint web-frontend
    ```

*   **Lint the Website:**
    ```bash
    npx nx lint website
    ```

## Code Conventions

*   **Structure:** The `web-frontend` project is organized by feature under `src/app`, with dedicated directories for components, routes, custom hooks, and state management (`store`).
*   **Styling:** Global styles and variables are located in `web-frontend/src/assets`. Component-specific styles are co-located with their components. Tailwind CSS is also used for utility-first styling.
*   **State Management:** Global state is managed with Zustand. See `web-frontend/src/app/store` for existing stores.
*   **Routing:** Application routes are defined in `web-frontend/src/app/routes/router.tsx`.
*   **Firebase:** Firestore queries are located in `web-frontend/src/app/firestore/queries.ts`. Firebase initialization is handled in `web-frontend/src/init-firebase-auth.ts`.
