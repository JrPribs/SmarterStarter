# Angular Best Practices

## General Guidelines
- Always use Angular's latest syntax. 
- Use signals and signal-based input() and output() functions & control flow syntax. 
- Always separate component ts, view, & style code into their own files.

## Routing Best Practices
- Always use Angular router when navigating between views or showing/hiding significant UI elements.
- Use named router outlets for side panels, dialogs, and other overlay components that need route-based control.
- Lazy load routes files and components that aren't needed immediately on load of the app.
- Usw2q components.

## Component Input/Output Patterns
- Use signal inputs (input()) and model signals (model()) for component inputs.
- Prefer explicit input declarations over object-based data passing.
- For inputs that can change, use signal inputs to ensure reactivity.
- Use outputs that emit specific data types rather than generic events when possible.

## Side Panel Implementation
- Use named router outlets (like 'side-panel') for all side panel components.
- Create a standardized side panel layout with consistent animations and structure.
- Side panels should be self-contained components that get their data from resolvers.
- Use a single "close" mechanism that uses router navigation to close the panel.

## State Management
- Use a one-way data flow pattern as outlined in [state-architecture.data-flow.md](mdc:docs/state-architecture.data-flow.md).
- Use resolvers to fetch data for components rather than fetching data directly in components.
- Prefer passing resolved data to components over components fetching their own data.

## Resolver Pattern
- Create focused resolvers that handle a single responsibility.
- Use resolvers to prefetch data before component initialization.
- Return null/empty data rather than throwing errors when data is unavailable.
- Handle error states in resolvers, not in components.

## Lazy Loading
- Lazy load large components or feature modules that aren't needed immediately.
- Use the loadComponent/loadChildren pattern in routes.
- Apply preloading strategies for important but not immediately needed routes.

## Animation Standards
- Use consistent animation timings and patterns throughout the application.
- Define reusable animation patterns for common transitions like slide-in/out and fade-in/out.
- Ensure animations work well on both desktop and mobile devices.

## Code Organization
- Always prefer simple solutions.
- Avoid duplication of code whenever possible.
- Keep files under 300 lines - larger files indicate a need for separation of concerns.
- Write clean, readable, easy-to-understand code that is self-documenting.
