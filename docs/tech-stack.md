# Tech Stack & Project Structure

## Technology Stack

### Core
- **React**: UI library for building the interface.
- **TypeScript**: Static typing for improved code quality and developer experience.
- **Vite**: Fast build tool and development server.

### Styling
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Styled Components**: Used for some specific component styling (e.g., `ElanBox`).
- **clsx / tailwind-merge**: For conditional class merging.

### State Management & Logic
- **Custom Linked List**: A `RouteLinkedList` class implementation for managing the complex state of job routes and stat calculations.
- **React Hooks**: Custom hooks like `useRouteLinkedList` for bridging the imperative class logic with React's declarative UI.

### Utilities
- **html-to-image**: For generating shareable images of the route table.
- **uuid**: For generating unique keys for list items.
- **Lucide React**: For icons.

## Directory Structure

```
src/
├── components/         # React components
│   ├── ui/             # Reusable UI components (Table, etc.)
│   ├── ElanBox.tsx     # Container component with specific styling
│   ├── JobSelector.tsx # Component for selecting jobs
│   └── ...
├── database/           # Static data and configuration
│   ├── job.ts          # Job definitions and enums
│   └── jobPointMap.ts  # Stat growth rules for each job
├── hooks/              # Custom React hooks
│   └── useRouteLinkedList.ts # Hook for managing RouteLinkedList state
├── lib/                # Core business logic and utilities
│   ├── routeLinkedList.ts # Doubly Linked List implementation for routes
│   ├── routeUtils.ts   # Helper functions for route manipulation
│   └── shareUtils.ts   # Image generation and sharing logic
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```
