# Ships Web Client

## Overview

The Ships Web Client is a monolithic frontend application that aims to provide a comprehensive user experience by integrating various games, services, and components into a single codebase. It is built using modern web technologies and follows best practices for accessibility, scalability, performance, and maintainability.

## Architecture

The application follows a modular architecture with the following key components:

- **Apps**: The main apps of the application are located in the `src/apps` directory. These apps handle routing and rendering the main content of the application.
- **Assets**: Static assets such as images, stylesheets, and fonts are stored in the `src/assets` folder.
- **Components**: Reusable UI components are located in the `src/components` directory.
- **Contexts**: Global state management is achieved using React Context API. Contexts are defined in the `src/contexts` directory.
- **Pages**: The main pages of the application are located in the `src/pages` directory. These pages handle routing and rendering the main content of the application.
- **Services**: API interactions are handled by service functions within the `src/services` directory.
- **Hooks**: Custom React hooks for shared logic are defined in the `src/hooks` directory.
- **Utils**: Helper functions and utility scripts are available in the `src/utils` directory.

Each app inside the apps folder will have its own set of components, pages, and services, allowing for a clear separation of concerns and a modular codebase.

## Structural Hierarchy

The Ships Web Client follows a hierarchical structure for organizing its elements:

- **Layouts**: Each layout wraps one or more pages providing shared UI elements such as headers, footers, and navigation. It also doubles as a context provider for state management.
- **Pages**: These are the main pages of the application. They serve as entry points or standalone pages.
- **Components**: Reusable UI components are used throughout the application, providing consistent and modular building blocks.
- **Views**: Views represent different sections or screens within a component.

This hierarchy ensures a clear separation of concerns and promotes reusability and maintainability in the codebase.

## Technology Stack

The Ships Web Client is built using the following technologies:

- **React & TypeScript**: Foundation of the application, ensuring robust and type-safe code.
- **Tailwind CSS & Next UI**: Aesthetic, functional, and accessible UI design, with a focus on theming for cohesive look and feel across games.
- **Framer Motion**: Advanced animation library for fluid, responsive UI transitions.

## Local Setup Guide

To set up the project on your local machine, follow these steps:

Run the following in your terminal to clone the project:

```sh
git clone https://git.timeplay.com/scm/ships/ships-web-client.git
```

If you have [`nvm`](https://github.com/nvm-sh/nvm) installed to manage node versions, you can run the following to use the version of node that this project uses:

```sh
nvm use
```

Run `npm install` to install the project dependencies.

Copy the `.env.example` file to `.env` and update the environment variables as needed.

### Running in Developement Mode

Run `npm run dev` to start the development server.

Open `https://localhost:[port]/frontend/ships-client` in your browser to view the application.

### Building for Production

Run `npm run build` to build the application for production.

## Deployment Notes

---
