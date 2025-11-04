# @lottery/dashboard - Client

This is the frontend application for the Lottery Bot, providing a web-based dashboard to manage and monitor the bot's activities.

## ✨ Features

-   **Bot Status**: View the bot's connection status and scan the QR code to log in.
-   **Payment Management**: View a list of recent payments, search for specific payments, and validate them.
-   **Play Management**: Browse recent lottery plays and search by number or date range.
-   **CSV Validation**: Upload a CSV file from the bank to bulk-validate payments.
-   **Settings**: Configure bot settings like allowed groups and supervisor numbers.

## 🚀 Tech Stack

-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components.
-   **Data Fetching**: [TanStack Query](https://tanstack.com/query) for server state management.
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Linting/Formatting**: [Biome](https://biomejs.dev/)

## ⚙️ Environment Variables

The client requires a `.env` file with the following variable:

-   `VITE_API_URL`: The URL of the running server application (e.g., `http://localhost:3000`).

See `.env.example` for the template.

## ▶️ How to Run

From the root of the monorepo, you can run the client with the following command:

```bash
npm run dev -w client
```

The application will be available at `http://localhost:5173` (or the port configured in `vite.config.ts`).
