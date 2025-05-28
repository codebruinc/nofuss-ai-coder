# NoFuss AI Coder

NoFuss AI Coder is a beginner-friendly, AI-assisted website builder that simplifies the process of creating and deploying websites. It guides users through three streamlined stages: idea clarification, building, and deployment.

![NoFuss AI Coder](app/public/pattern-bg.svg)

## 🌟 Project Overview

### What is NoFuss AI Coder?

NoFuss AI Coder is an application designed to make website creation accessible to beginners by leveraging AI assistance throughout the development process. It removes technical barriers and guides users from initial concept to a fully deployed website.

### Key Features

- **Three-Stage Development Process**: Structured approach to website creation
- **AI-Powered Guidance**: Intelligent assistance at every step
- **Beginner-Friendly Interface**: No coding experience required
- **Integrated Preview Environment**: See changes in real-time
- **Simplified Deployment**: Easy publishing options for your website

### Target Audience

NoFuss AI Coder is specifically designed for:
- Beginners with little to no coding experience
- Small business owners looking to create a web presence
- Students learning web development
- Anyone who wants to quickly create a website without technical complexity

## 🏗️ System Architecture

### Three-Stage Process

1. **Idea Clarification Stage**
   - AI-powered chat interface to help users define their website requirements
   - Powered by GPT-4o via OpenRouter
   - Generates a structured project specification

2. **bolt.new Build Stage**
   - Integrated coding and preview environment
   - AI assistance for code generation and modifications
   - Real-time preview of website changes

3. **Deployment Stage**
   - Guided deployment process
   - Multiple deployment options (Vercel, manual download, etc.)
   - Step-by-step instructions for each deployment method

### Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: OpenRouter (GPT-4o)
- **Build Environment**: bolt.new
- **Deployment**: Various options including Vercel

### System Components and Interactions

The application consists of several interconnected components:

- **Authentication System**: Handles user registration, login, and session management
- **Project Management**: Stores and retrieves user projects
- **Idea Clarification**: AI chat interface for project specification
- **Build Environment**: Integrated code editor and preview
- **Deployment Helper**: Guides for publishing websites

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Git
- A Supabase account
- An OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nofuss-ai-coder.git
   cd nofuss-ai-coder/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up bolt.new:
   ```bash
   npm run setup-bolt
   ```

### Environment Variables

Create a `.env.local` file in the app directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenRouter API
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
```

### Database Setup

1. Create a new project in Supabase
2. Run the SQL queries from the architecture document to set up the required tables:
   - Users Table
   - Projects Table
   - Project History Table

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
npm run start
```

## 📝 Usage Guide

### Creating a New Project

1. Register or log in to your account
2. Navigate to the dashboard
3. Click "Create New Project"
4. Enter a name and description for your project
5. Click "Create" to start the Idea Clarification Stage

### Using the Idea Clarification Stage

1. Engage with the AI assistant to describe your website requirements
2. Provide details about:
   - Website purpose
   - Target audience
   - Key features
   - Design preferences
   - Content sections
3. Review the generated project summary
4. Click "Continue to Build" when satisfied

### Working with the bolt.new Build Stage

1. The bolt.new environment will load with initial files based on your specifications
2. Use the integrated code editor to modify files
3. See changes in real-time in the preview panel
4. Ask the AI assistant for help with specific coding tasks
5. Save your progress regularly
6. Click "Continue to Deployment" when your website is ready

### Deploying Your Project

1. Choose from available deployment options:
   - Vercel deploy via GitHub
   - Download ZIP of project
   - Copy-paste code setup
2. Follow the step-by-step instructions provided by the DeployHelper
3. Verify your deployment is successful
4. Share your new website with the world!

## 👥 Contributing Guidelines

We welcome contributions to NoFuss AI Coder! Here's how you can contribute:

### Contribution Process

1. Fork the repository
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit your changes with descriptive commit messages:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
5. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request against the main repository

### Code Style and Conventions

- Follow the existing code style in the project
- Use TypeScript for type safety
- Write clear, descriptive comments
- Include tests for new features when possible

### Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if necessary
3. Get at least one code review from a maintainer
4. Once approved, your PR will be merged

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [bolt.new](https://bolt.new) for the integrated coding environment
- [OpenRouter](https://openrouter.ai) for AI model access
- [Supabase](https://supabase.com) for authentication and database services
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- All contributors who have helped improve this project