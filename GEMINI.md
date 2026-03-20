# Gemini Workspace Context: FitLab

This document provides context for the FitLab monorepo, which includes a web application and its corresponding marketing website.

## Project Overview

FitLab is a fitness tracking application designed to help users monitor their physical and mental progress. The project is structured as an Nx monorepo and utilizes Firebase for its backend services.

The monorepo contains two main projects:

1.  `web-frontend`: The core application, built with React, Vite, and TypeScript. It allows users to log various metrics, including body measurements, mood, and progress photos. It uses Zustand for state management, React Router for navigation, and i18next for internationalization. The application is deployed on Firebase Hosting.
2.  `website`: A Next.js-based marketing and information website for the FitLab application.

### Key Technologies & Dependencies

To mitigate dependency hallucinations, adhere strictly to these versions:

*   **Monorepo:** Nx `22.5.0`
*   **Frontend App (`web-frontend`):** React `^19.0.0`, Vite `^7.0.0`, TypeScript `~5.9.2`
*   **Website (`website`):** Next.js `16.1.6`, React `^19.0.0`
*   **State Management:** Zustand `^5.0.9`
*   **Routing:** React Router DOM `6.30.3`
*   **Backend:** Firebase `^12.6.0`
*   **Forms & Validation:** React Hook Form `^7.70.0`, Zod `^4.3.5`
*   **Icons:** Lucide React `^0.563.0`
*   **Styling:** SCSS (Sass `1.62.1`), Tailwind CSS `^4.1.18`, PostCSS `8.4.38`
*   **Internationalization:** i18next `^25.7.3`, React-i18next `^16.5.1`
*   **Charts:** Recharts `^3.7.0`
*   **Testing:** Vitest `4.0.9`, React Testing Library `16.3.0`, Playwright `^1.36.0`

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
    The output is generated in `dist/apps/web-frontend`, which is the public directory for Firebase Hosting.

*   **Build the Website for production:**
    ```bash
    npx nx build website
    ```
    The output is generated in `dist/apps/website`.

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

*   **Structure:** The `web-frontend` project is organized by feature under `apps/web-frontend/src/app`, with dedicated directories for components, routes, custom hooks, and state management (`store`).
*   **Styling:**
    *   **Mandatory:** Use **SCSS** (`.scss`) for all style files.
    *   Global styles and variables are in `apps/web-frontend/src/assets`.
    *   Component-specific styles MUST be co-located with their components as SCSS files.
    *   Tailwind CSS is used for utility-first styling alongside SCSS.
*   **Icons:**
    *   **Mandatory:** Use **Lucide React** for all icons.
*   **State Management:** Global state is managed with Zustand. See `apps/web-frontend/src/app/store` for existing stores.
*   **Routing:** Application routes are defined in `apps/web-frontend/src/app/routes/router.tsx`.
*   **Firebase:** Firestore queries are located in `apps/web-frontend/src/app/firestore/queries.ts`. Firebase initialization is handled in `apps/web-frontend/src/init-firebase-auth.ts`.
