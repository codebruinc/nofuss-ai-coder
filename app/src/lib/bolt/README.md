# bolt.new Integration for NoFuss AI Coder

This directory contains the integration of the [bolt.new](https://github.com/stackblitz/bolt.new) system into the NoFuss AI Coder application. bolt.new provides an AI-assisted code editing and preview environment that we use for the Build Stage of our application.

## Setup

To set up the bolt.new integration, run the following command from the project root:

```bash
npm run setup-bolt
```

This will:
1. Clone the bolt.new repository into `src/lib/bolt/bolt.new`
2. Install the necessary dependencies

## Integration Components

The integration consists of the following components:

### 1. BoltClient

`client.ts` provides a client for interacting with the bolt.new system. It includes methods for:

- Initializing a new bolt.new project
- Getting initial messages for the bolt.new chat
- Saving the current state of a bolt.new project

### 2. UI Components

The UI components for the Build Stage are located in `src/components/build/`:

- `BoltChat.tsx`: The main component that integrates the bolt.new chat interface
- `DeploymentTransition.tsx`: A component that handles the transition from the Build Stage to the Deployment Stage

### 3. API Routes

The API routes for the Build Stage are located in `src/app/api/build/`:

- `[projectId]/route.ts`: Gets the build environment for a project
- `[projectId]/save/route.ts`: Saves the current state of a project
- `chat/route.ts`: Handles communication with the bolt.new chat interface

## How It Works

1. When a user completes the Idea Clarification Stage, they are directed to the Build Stage.
2. The Build Stage initializes a bolt.new project with the specifications from the Idea Clarification Stage.
3. The user can interact with the bolt.new chat interface to build their website.
4. The bolt.new system generates code based on the user's requests and displays a live preview.
5. The user can save their progress at any time.
6. When the user is satisfied with their website, they can proceed to the Deployment Stage.

## Customization

The bolt.new system has been customized to:

1. Accept project specifications from the Idea Clarification Stage
2. Save project progress in Supabase
3. Provide a smooth transition to the Deployment Stage

## Troubleshooting

If you encounter issues with the bolt.new integration:

1. Make sure you have run `npm run setup-bolt` to set up the bolt.new repository
2. Check the browser console for any errors
3. Verify that the API routes are working correctly
4. Ensure that the Supabase connection is properly configured