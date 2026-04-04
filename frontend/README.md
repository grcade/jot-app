# JotApp Frontend

A React + Vite frontend scaffold for the Tasks API.

## Features
- **React + Vite**: Fast development and build.
- **Tailwind CSS v4**: Modern styling with zero configuration.
- **Redux Toolkit (RTK)**: Centralized state management.
- **RTK Query**: Powerful data fetching and caching, integrated with the OpenAPI spec.
- **React Router**: Client-side routing for seamless navigation.
- **Lucide React**: Beautiful icons.

## Project Structure
- `src/api`: RTK Query base API slice.
- `src/app`: Redux store configuration.
- `src/features`: Feature-specific logic (auth, notes, tasks) including RTK Query endpoints and slices.
- `src/pages`: Application views (Login, Register, Dashboard, NoteDetails).
- `src/layout`: Main application layout and navigation.
- `src/utils`: Utility functions and environment configuration.

## Setup Instructions

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the `frontend` directory (optional, defaults are set in `src/utils/env.js`):
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api/v1
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Build for production**:
    ```bash
    npm run build
    ```

## API Integration
The frontend uses RTK Query to interact with the backend API. Endpoints are defined in:
- `src/features/auth/userApiSlice.js`
- `src/features/notes/notesApiSlice.js`
- `src/features/tasks/tasksApiSlice.js`

Authentication is handled via a Bearer token stored in the Redux store and persisted in `localStorage`.
