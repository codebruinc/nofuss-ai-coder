import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const platform = params.platform;
    
    // Get the project ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
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
    
    // Return the deployment instructions for the specified platform
    let instructions;
    
    switch (platform) {
      case 'vercel':
        instructions = {
          title: 'Deploying to Vercel',
          description: 'Vercel is a cloud platform for static sites and serverless functions. It\'s free for personal projects and very easy to use.',
          steps: [
            {
              title: 'Create a GitHub repository',
              description: 'First, you need to create a GitHub repository for your project.',
              details: [
                'Go to GitHub.com and sign in (or create an account if you don\'t have one)',
                'Click the "+" icon in the top-right corner and select "New repository"',
                `Name your repository (for example, "${project.name}")`,
                'Choose "Public" (unless you want to keep your code private)',
                'Click "Create repository"'
              ]
            },
            {
              title: 'Push your code to GitHub',
              description: 'Next, you need to push your code to the GitHub repository.',
              details: [
                'Follow the instructions on GitHub to push your code',
                'You can use the GitHub Desktop app if you\'re not familiar with Git commands'
              ]
            },
            {
              title: 'Connect to Vercel',
              description: 'Now, you can connect your GitHub repository to Vercel.',
              details: [
                'Go to Vercel.com and sign in with your GitHub account',
                'Click "Add New..." and select "Project"',
                'Find your GitHub repository in the list and click "Import"',
                'Keep the default settings and click "Deploy"'
              ]
            },
            {
              title: 'Your site is live!',
              description: 'Vercel will automatically build and deploy your site. When it\'s done, you\'ll get a URL where your site is live.',
              details: [
                'You can share this URL with anyone to show them your website',
                'Any changes you push to your GitHub repository will be automatically deployed'
              ]
            }
          ],
          resources: [
            {
              title: 'Vercel Documentation',
              url: 'https://vercel.com/docs'
            },
            {
              title: 'GitHub Documentation',
              url: 'https://docs.github.com/en/get-started'
            }
          ]
        };
        break;
      
      case 'netlify':
        instructions = {
          title: 'Deploying to Netlify',
          description: 'Netlify is a web developer platform that multiplies productivity. It\'s free for personal projects and very easy to use.',
          steps: [
            {
              title: 'Create a Netlify account',
              description: 'First, you need to create a Netlify account.',
              details: [
                'Go to Netlify.com and sign up (you can use your GitHub account)',
                'Verify your email address'
              ]
            },
            {
              title: 'Deploy your site',
              description: 'There are two ways to deploy your site to Netlify:',
              details: [
                'Option 1: Connect to GitHub - Similar to Vercel, you can connect your GitHub repository to Netlify',
                'Option 2: Drag and drop - You can simply drag and drop your project folder onto the Netlify dashboard'
              ]
            },
            {
              title: 'Configure your site',
              description: 'Netlify will automatically detect your project settings, but you can customize them if needed.',
              details: [
                'Set your build command (if needed)',
                'Set your publish directory (if needed)',
                'Click "Deploy site"'
              ]
            },
            {
              title: 'Your site is live!',
              description: 'Netlify will build and deploy your site. When it\'s done, you\'ll get a URL where your site is live.',
              details: [
                'You can share this URL with anyone to show them your website',
                'You can also set up a custom domain in the Netlify dashboard'
              ]
            }
          ],
          resources: [
            {
              title: 'Netlify Documentation',
              url: 'https://docs.netlify.com/'
            }
          ]
        };
        break;
      
      case 'github-pages':
        instructions = {
          title: 'Deploying to GitHub Pages',
          description: 'GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub.',
          steps: [
            {
              title: 'Create a GitHub repository',
              description: 'First, you need to create a GitHub repository for your project.',
              details: [
                'Go to GitHub.com and sign in (or create an account if you don\'t have one)',
                'Click the "+" icon in the top-right corner and select "New repository"',
                `Name your repository "${project.name}" or "username.github.io" for a user site`,
                'Choose "Public" (GitHub Pages requires a public repository for free accounts)',
                'Click "Create repository"'
              ]
            },
            {
              title: 'Push your code to GitHub',
              description: 'Next, you need to push your code to the GitHub repository.',
              details: [
                'Follow the instructions on GitHub to push your code',
                'Make sure your main HTML file is named "index.html"'
              ]
            },
            {
              title: 'Enable GitHub Pages',
              description: 'Now, you need to enable GitHub Pages for your repository.',
              details: [
                'Go to your repository on GitHub',
                'Click "Settings"',
                'Scroll down to the "GitHub Pages" section',
                'Select the branch you want to deploy (usually "main" or "master")',
                'Click "Save"'
              ]
            },
            {
              title: 'Your site is live!',
              description: 'GitHub will build and deploy your site. When it\'s done, you\'ll get a URL where your site is live.',
              details: [
                'The URL will be something like "username.github.io/repository-name"',
                'You can share this URL with anyone to show them your website'
              ]
            }
          ],
          resources: [
            {
              title: 'GitHub Pages Documentation',
              url: 'https://docs.github.com/en/pages'
            }
          ]
        };
        break;
      
      case 'download-zip':
        instructions = {
          title: 'Downloading as ZIP',
          description: 'You can download your project as a ZIP file and deploy it manually to any hosting service.',
          steps: [
            {
              title: 'Download your project',
              description: 'First, you need to download your project as a ZIP file.',
              details: [
                'Click the "Download ZIP" button',
                'Save the ZIP file to your computer',
                'Extract the ZIP file to a folder on your computer'
              ]
            },
            {
              title: 'Choose a hosting provider',
              description: 'There are many options for hosting your website:',
              details: [
                'Netlify (free, beginner-friendly)',
                'GitHub Pages (free for public repositories)',
                'Cloudflare Pages (free, fast global CDN)',
                'Amazon S3 (pay-as-you-go)',
                'Google Cloud Storage (pay-as-you-go)'
              ]
            },
            {
              title: 'Upload your files',
              description: 'The exact steps depend on your chosen hosting provider, but generally:',
              details: [
                'Create an account with your chosen provider',
                'Create a new project/bucket/site',
                'Upload your files (either through a web interface or using their CLI tools)',
                'Configure any necessary settings (like enabling static website hosting)'
              ]
            },
            {
              title: 'Your site is live!',
              description: 'Once you\'ve uploaded your files, your site will be live at the URL provided by your hosting provider.',
              details: [
                'You can share this URL with anyone to show them your website',
                'Some providers allow you to set up a custom domain'
              ]
            }
          ],
          resources: [
            {
              title: 'Netlify Documentation',
              url: 'https://docs.netlify.com/'
            },
            {
              title: 'GitHub Pages Documentation',
              url: 'https://docs.github.com/en/pages'
            },
            {
              title: 'Cloudflare Pages Documentation',
              url: 'https://developers.cloudflare.com/pages/'
            }
          ]
        };
        break;
      
      case 'copy-paste':
        instructions = {
          title: 'Copy-Paste Code',
          description: 'You can copy the code and set it up manually on your own hosting.',
          steps: [
            {
              title: 'Copy your code',
              description: 'First, you need to copy the code for each file in your project.',
              details: [
                'Copy the HTML code (index.html)',
                'Copy the CSS code (styles.css)',
                'Copy the JavaScript code (script.js)',
                'Copy any other files you need'
              ]
            },
            {
              title: 'Set up locally',
              description: 'You can test your site locally before deploying it.',
              details: [
                'Create a new folder on your computer',
                'Create the files (index.html, styles.css, script.js, etc.) and paste the code into them',
                'Open the index.html file in your browser to test'
              ]
            },
            {
              title: 'Choose a hosting provider',
              description: 'There are many options for hosting your website:',
              details: [
                'Netlify (free, beginner-friendly)',
                'GitHub Pages (free for public repositories)',
                'Cloudflare Pages (free, fast global CDN)',
                'Amazon S3 (pay-as-you-go)',
                'Google Cloud Storage (pay-as-you-go)'
              ]
            },
            {
              title: 'Upload your files',
              description: 'The exact steps depend on your chosen hosting provider, but generally:',
              details: [
                'Create an account with your chosen provider',
                'Create a new project/bucket/site',
                'Upload your files (either through a web interface or using their CLI tools)',
                'Configure any necessary settings (like enabling static website hosting)'
              ]
            }
          ],
          resources: [
            {
              title: 'Netlify Documentation',
              url: 'https://docs.netlify.com/'
            },
            {
              title: 'GitHub Pages Documentation',
              url: 'https://docs.github.com/en/pages'
            },
            {
              title: 'Cloudflare Pages Documentation',
              url: 'https://developers.cloudflare.com/pages/'
            }
          ]
        };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid platform' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ instructions });
  } catch (error) {
    console.error('Error fetching deployment instructions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment instructions' },
      { status: 500 }
    );
  }
}