import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { Message } from '@/types';

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the request body
    const body = await request.json();
    const { messages, projectId } = body;
    
    if (!messages || !Array.isArray(messages) || !projectId) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(
      (message: Message) => message.role === 'user'
    );
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }
    
    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // In a real implementation, this would send the message to an AI model
    // and return the response. For now, we'll return predefined responses
    // based on the user's message.
    
    // Log the chat message in project history
    const { error: historyError } = await supabase
      .from('project_history')
      .insert({
        project_id: projectId,
        action: 'deploy_chat_message',
        metadata: {
          timestamp: new Date().toISOString(),
          message: lastUserMessage.content.substring(0, 100) + (lastUserMessage.content.length > 100 ? '...' : '')
        }
      });
    
    if (historyError) {
      console.error('Error logging chat message:', historyError);
      // Continue even if logging fails
    }
    
    // Generate a response based on the user's message
    const content = generateDeployHelperResponse(lastUserMessage.content, project.name);
    
    // Return the response
    return NextResponse.json({
      role: 'assistant',
      content
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// Helper function to generate responses based on user input
function generateDeployHelperResponse(userMessage: string, projectName: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Check for Vercel deployment questions
  if (lowerCaseMessage.includes('vercel') || lowerCaseMessage.includes('option 1') || lowerCaseMessage.includes('github')) {
    return `
Great choice! Deploying to Vercel is super easy. Here's how to do it:

## Step 1: Create a GitHub repository
1. Go to [GitHub](https://github.com) and sign in (or create an account if you don't have one)
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (for example, "${projectName}")
4. Choose "Public" (unless you want to keep your code private)
5. Click "Create repository"

## Step 2: Connect to Vercel
1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." and select "Project"
3. Find your GitHub repository in the list and click "Import"
4. Keep the default settings and click "Deploy"

That's it! Vercel will automatically build and deploy your site. When it's done, you'll get a URL where your site is live.

Would you like me to explain any of these steps in more detail?
`;
  }
  
  // Check for download ZIP questions
  if (lowerCaseMessage.includes('download') || lowerCaseMessage.includes('zip') || lowerCaseMessage.includes('option 2')) {
    return `
Downloading your project as a ZIP file is a great option! Here's how:

## Step 1: Download your project
1. Click the "Download ZIP" button at the top of this page
2. Save the ZIP file to your computer
3. Extract the ZIP file to a folder on your computer

## Step 2: Choose a hosting provider
There are many options for hosting your website:
- [Netlify](https://netlify.com) (free, beginner-friendly)
- [GitHub Pages](https://pages.github.com) (free for public repositories)
- [Cloudflare Pages](https://pages.cloudflare.com) (free, fast global CDN)

## Step 3: Upload your files
For example, with Netlify:
1. Go to [Netlify](https://netlify.com) and create an account
2. Click "Add new site" and select "Deploy manually"
3. Drag and drop your project folder onto the upload area
4. Wait for the upload to complete, and your site will be live!

Would you like more specific instructions for a particular hosting provider?
`;
  }
  
  // Check for copy-paste code questions
  if (lowerCaseMessage.includes('copy') || lowerCaseMessage.includes('paste') || lowerCaseMessage.includes('option 3') || lowerCaseMessage.includes('code')) {
    return `
The copy-paste option is perfect if you want to use the code elsewhere! Here's how:

## Step 1: Copy your code
I'll help you copy the important files:

\`\`\`html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Your HTML content here -->
  <script src="script.js"></script>
</body>
</html>
\`\`\`

\`\`\`css
/* styles.css */
/* Your CSS styles here */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}
\`\`\`

\`\`\`javascript
// script.js
// Your JavaScript code here
console.log('${projectName} is running!');
\`\`\`

## Step 2: Set up locally
1. Create a new folder on your computer
2. Create the files above and paste the code into them
3. Open the index.html file in your browser to test

## Step 3: Upload to any hosting
Once you're happy with your site, you can upload these files to any web hosting service.

Would you like me to explain how to set this up on a specific platform?
`;
  }
  
  // Default response for other questions
  return `
I'm here to help you deploy your website "${projectName}"! Here are the options again:

## Option 1: Deploy with Vercel (Recommended for beginners)
This is the easiest option! Vercel is free and perfect for personal projects.

## Option 2: Download your project
I can help you download your entire project as a ZIP file and guide you through uploading it to any hosting service.

## Option 3: Copy the code
I can help you copy all the important code and provide simple setup instructions.

Which option would you like to learn more about? Or do you have a specific question about deploying your website?
`;
}