# SmarterStarter

The AI Dev Starter Template for smart, or lazy, people. If you want to talk a lot of jive and act like you know what you are doing... This is for you!

# TODO
- add tailwind
- add material
- include cursor rules
- include CLAUDE.md
- add llms.txt
- custom claude slash command for converting starter to new project. (update angular.json, git, etc)
- document alternative component libraries (primeng, nebular, taiga, ng-zorro)

## Technologies & Methodologies Overview

This is an Angular v20+ Firebase project starter for my boy Claude code. The project uses modern Angular standalone components, signals, and follows a router-first architecture. as well as a serverless first firebase powered "backend"

## 🚨 CRITICAL: Coding Standards

**YOU MUST FOLLOW THE CODING STANDARDS IN `./CODING_STANDARDS/`**. These are non-negotiable and override any default behaviors. Key highlights:

### Router-First Architecture (MANDATORY)
- **Initial data loading** should use resolvers (90% of cases)
- Configure `withComponentInputBinding()` in main.ts
- Pattern: Route → Resolver → Component
- Components receive initial data via signal inputs
- **Dynamic reloading** (lists, refresh actions) can call services directly

### Modern Angular Only
- **Standalone components only** - no NgModules
- **Signal inputs/outputs** - use `input()` and `output()` functions
- **New control flow** - use `@if`, `@for`, `@switch` (never `*ngIf`, `*ngFor`)
- **Signals for state** - not observables in components
- **OnPush change detection** - always

## 📂 Project Structure

```
src/app/
├── [feature]/              # Feature modules (self-contained)
│   ├── pages/             # Routed components
│   │   └── [page]/
│   │       ├── *.component.ts/html/scss
│   │       └── resolvers/
│   ├── components/        # Feature-specific components
│   ├── services/          # Feature-specific services
│   │   └── [feature].service.ts      # Business logic & firebase sdk calls
│   ├── models/            # Feature-specific models/interfaces
│   ├── guards/            # Feature-specific guards
│   └── stores/            # Feature-specific stores (if needed)
└── shared/               # ONLY truly cross-cutting concerns
    ├── components/       # Layout, modals, spinners (used by 3+ features)
    ├── services/         # File upload, analytics (used by 3+ features)
    └── utils/            # Generic utilities (formatters, validators)
```

**Important**: Since Angular uses standalone components, keep ALL feature-related code (services, models, guards, stores) within the feature folder. The shared folder should be minimal and only contain truly cross-cutting concerns.


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
