# Architecture: Route Linked List

## Overview
The core logic of the Route Calculator is built upon a custom Doubly Linked List implementation (`RouteLinkedList`). This structure is chosen because character growth in Elancia is sequential, and changes in an earlier job (node) directly affect the stats and possibilities of subsequent jobs.

## Key Components

### 1. RouteLinkedList (`src/lib/routeLinkedList.ts`)
The main class managing the list of jobs.
- **Nodes**: Manages a chain of `RouteNode` objects.
- **Operations**: Supports `add`, `removeAt`, `insertAt` operations.
- **Recalculation**: Ensures that changes in one node propagate to subsequent nodes to maintain stat consistency.

### 2. RouteNode (`src/lib/routeLinkedList.ts`)
Represents a single job in the route.
- **State**: Stores the `job` type, `jobPo` (Job Points), and current `stats`.
- **Links**: Holds references to `prev` and `next` nodes.
- **Logic**:
    - `adjustJobPoint(delta)`: Updates job points and triggers stat recalculation.
    - `recalculate()`: Recalculates stats based on previous node's state and current job points.
    - `changeStats()`: Applies stat changes based on defined intervals and limits.

### 3. Data Flow
1.  **User Action**: User adds a job or adjusts points in the UI.
2.  **Hook Interaction**: `useRouteLinkedList` hook receives the action.
3.  **Linked List Update**: The action is performed on the `RouteLinkedList` instance.
4.  **Propagation**:
    - If a job is added, a new node is linked.
    - If points change, the node updates its stats and calls `recalculate()` on the `next` node.
    - This chain reaction ensures all subsequent stats are correct.
5.  **React Update**: The hook detects the change (via `version` state or explicit set) and triggers a re-render of the UI.

## Stat Calculation Logic
- **Job Point Map**: Defined in `src/database/jobPointMap.ts`, this maps job point intervals to stat changes (e.g., +1 STR every 10 points).
- **Limits**: Stats have maximum limits (usually determined by the job or game rules). The logic ensures stats do not exceed these limits or drop below baselines.
- **Backtracking**: When points are reduced, the logic reverses the stat gains correctly, handling edge cases where stats might have been capped.
