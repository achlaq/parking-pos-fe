# Parking Management System - Frontend

This repository contains the frontend source code for a Point of Sale (POS) application designed for managing parking facilities. The system provides a web-based interface for handling daily parking operations, including vehicle check-in, check-out, and viewing operational analytics.

## Core Features

- **Vehicle Check-in:** A streamlined interface for registering incoming vehicles.
- **Vehicle Check-out:** Functionality to process departing vehicles, including calculating parking duration and fees.
- **Analytics Dashboard:** A dashboard that presents real-time parking statistics and data visualizations.
- **Member Management:** Backend support for managing member accounts and specialized rates.
- **Responsive UI:** The user interface is designed to be functional across various screen sizes.

## Technology Stack

This project is built with a modern frontend stack:

- **Core Framework:** React
- **Build Tool:** Vite
- **UI Components:** Ant Design
- **Styling:** Sass (SCSS)
- **Client State Management:** TanStack React Query
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Code Quality:** ESLint

## Project Setup

To set up and run this project locally, please follow the steps below.

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (v18.x or later)
- npm (Node Package Manager)

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/achlaq/parking-pos-fe.git
    cd parking-pos-fe
    ```

2.  Install the required project dependencies:
    ```sh
    npm install
    ```

### Available Scripts

- **`npm run dev`**: Starts the development server with hot-reloading. The application can be accessed at `http://localhost:5173`.
- **`npm run build`**: Compiles and bundles the application for production into the `dist` directory.
- **`npm run lint`**: Analyzes the source code to find and fix stylistic or programmatic errors.
- **`npm run preview`**: Serves the production build locally to preview before deployment.
