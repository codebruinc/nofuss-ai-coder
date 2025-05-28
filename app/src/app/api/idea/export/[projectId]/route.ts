import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the project with its idea summary
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .eq('user_id', session.user.id)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    if (!project.idea_summary) {
      return NextResponse.json(
        { error: 'Project has no idea summary' },
        { status: 400 }
      );
    }
    
    // Log the export action in project history
    const { error: historyError } = await supabase
      .from('project_history')
      .insert({
        project_id: params.projectId,
        action: 'export_to_build',
        metadata: {
          timestamp: new Date().toISOString()
        }
      });
    
    if (historyError) {
      console.error('Error logging export action:', historyError);
      // Continue even if logging fails
    }
    
    return NextResponse.json({ 
      summary: project.idea_summary,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        bolt_project_id: project.bolt_project_id
      }
    });
  } catch (error) {
    console.error('Error exporting idea summary:', error);
    return NextResponse.json(
      { error: 'Failed to export idea summary' },
      { status: 500 }
    );
  }
}