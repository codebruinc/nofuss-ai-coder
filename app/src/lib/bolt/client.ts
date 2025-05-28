import { IdeaSummary, Project } from '@/types';

/**
 * BoltClient provides methods to interact with the bolt.new system
 */
export class BoltClient {
  /**
   * Initialize a new bolt.new project with the given specifications
   * 
   * @param project The project metadata
   * @param ideaSummary The idea summary from the Idea Clarification Stage (can be null for new projects)
   * @returns The bolt project ID
   */
  static async initializeProject(project: Project, ideaSummary: IdeaSummary | null): Promise<string> {
    // In a real implementation, this would create a new bolt.new project
    // For now, we'll just return a placeholder ID
    return `bolt-${Date.now()}`;
  }

  /**
   * Get the initial messages for the bolt.new chat based on the idea summary
   * 
   * @param ideaSummary The idea summary from the Idea Clarification Stage (can be null for new projects)
   * @returns An array of messages to initialize the bolt.new chat
   */
  static getInitialMessages(ideaSummary: IdeaSummary | null) {
    if (!ideaSummary) {
      return [
        {
          role: 'system',
          content: `You are Bolt, an AI assistant from StackBlitz that helps users build web applications.
          You have access to a code editor and preview environment. You can create, modify, and delete files.
          
          Your task is to help the user build a website. Start by asking them what kind of website they want to build.`
        },
        {
          role: 'assistant',
          content: `Hi there! I'm Bolt, and I'm here to help you build a website. What kind of website would you like to create today? For example:

1. A personal portfolio
2. A business landing page
3. A blog
4. An e-commerce store
5. Something else entirely

Let me know what you have in mind, and we can get started right away!`
        }
      ];
    }

    return [
      {
        role: 'system',
        content: `You are Bolt, an AI assistant from StackBlitz that helps users build web applications.
        You have access to a code editor and preview environment. You can create, modify, and delete files.
        
        The user wants to build a website with the following specifications:
        
        Purpose: ${ideaSummary.purpose}
        
        Target Audience: ${ideaSummary.target_audience}
        
        Key Features:
        ${ideaSummary.key_features.map(feature => `- ${feature}`).join('\n')}
        
        Design Preferences:
        - Color Scheme: ${ideaSummary.design_preferences.color_scheme}
        - Style: ${ideaSummary.design_preferences.style}
        - Layout: ${ideaSummary.design_preferences.layout}
        
        Content Sections:
        ${ideaSummary.content_sections.map(section => `- ${section}`).join('\n')}
        
        Your task is to help the user build this website. Start by suggesting a project structure and initial files.`
      },
      {
        role: 'assistant',
        content: `I'll help you build a website based on your requirements. Let's start by creating a project structure that will work well for your needs.

Based on your specifications, I recommend a simple but effective structure using HTML, CSS, and JavaScript. Let's begin by creating the following files:

1. index.html - Main entry point for your website
2. styles.css - For styling your website according to your design preferences
3. script.js - For any interactive elements

Would you like me to create these files now with some initial content based on your requirements?`
      }
    ];
  }

  /**
   * Save the current state of a bolt.new project
   *
   * @param boltProjectId The bolt project ID
   * @returns Success status
   */
  static async saveProjectState(boltProjectId: string): Promise<boolean> {
    // In a real implementation, this would save the current state of the bolt.new project
    // For now, we'll just return true
    return true;
  }

  /**
   * Get the initial messages for the DeployHelper role in the bolt.new chat
   *
   * @param project The project metadata
   * @returns An array of messages to initialize the DeployHelper chat
   */
  static getDeployHelperMessages(project: Project) {
    return [
      {
        role: 'system',
        content: `You are DeployHelper, an AI assistant from StackBlitz that helps users deploy their web applications.
        
        Your task is to guide the user through deploying their website "${project.name}" in a beginner-friendly way.
        
        You should offer the following deployment options:
        
        1. Vercel deploy via GitHub - Guide the user through connecting their GitHub account and deploying with Vercel.
        2. Download ZIP of project - Provide instructions for downloading their project as a ZIP file and manually deploying it.
        3. Copy-paste code setup - Offer a simple way to copy the code and set it up on their own hosting.
        
        For each option, provide clear, step-by-step instructions that are easy for beginners to follow.
        Use friendly, encouraging language and avoid technical jargon when possible.
        If technical terms are necessary, explain them briefly.
        
        Always ask if they need clarification on any step and offer to provide more detailed instructions if needed.`
      },
      {
        role: 'assistant',
        content: `Hi there! I'm here to help you deploy your website "${project.name}" so everyone can see it online.

Let's make this super easy! Here are three beginner-friendly ways to get your site online:

## Option 1: Deploy with Vercel (Recommended for beginners)
This is the easiest option! Vercel is free and perfect for personal projects.

1. Would you like me to guide you through connecting to GitHub and deploying with Vercel?

## Option 2: Download your project
If you prefer to host your site somewhere specific:

1. I can help you download your entire project as a ZIP file
2. Then guide you through uploading it to any hosting service you prefer

## Option 3: Copy the code
If you just want the code to use elsewhere:

1. I can help you copy all the important code
2. Provide simple setup instructions to get it running anywhere

Which option sounds best for you? I'll walk you through every step of the process!`
      }
    ];
  }
}