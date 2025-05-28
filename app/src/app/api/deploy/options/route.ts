import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Return the available deployment options
    return NextResponse.json({
      options: [
        {
          id: 'vercel',
          name: 'Vercel',
          description: 'Easy deployment for Next.js projects',
          beginner_friendly: true,
          free_tier: true,
          steps: [
            'Connect to GitHub',
            'Import repository',
            'Deploy automatically'
          ]
        },
        {
          id: 'netlify',
          name: 'Netlify',
          description: 'Simple deployment with continuous integration',
          beginner_friendly: true,
          free_tier: true,
          steps: [
            'Connect to GitHub or upload files',
            'Configure build settings',
            'Deploy automatically'
          ]
        },
        {
          id: 'github-pages',
          name: 'GitHub Pages',
          description: 'Free hosting for static websites',
          beginner_friendly: false,
          free_tier: true,
          steps: [
            'Create GitHub repository',
            'Push code to repository',
            'Enable GitHub Pages in repository settings'
          ]
        },
        {
          id: 'download-zip',
          name: 'Download ZIP',
          description: 'Download your project as a ZIP file',
          beginner_friendly: true,
          free_tier: true,
          steps: [
            'Download ZIP file',
            'Extract files',
            'Upload to any hosting service'
          ]
        },
        {
          id: 'copy-paste',
          name: 'Copy-Paste Code',
          description: 'Copy the code and set it up manually',
          beginner_friendly: true,
          free_tier: true,
          steps: [
            'Copy code for each file',
            'Create files locally',
            'Upload to any hosting service'
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching deployment options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment options' },
      { status: 500 }
    );
  }
}