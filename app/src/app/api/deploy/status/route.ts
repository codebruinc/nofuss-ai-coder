import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { DeploymentStatus } from '@/types';

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
    const { projectId, status, deploymentUrl } = body;
    
    if (!projectId || !status) {
      return NextResponse.json(
        { error: 'Project ID and status are required' },
        { status: 400 }
      );
    }
    
    // Validate the status
    const validStatuses: DeploymentStatus[] = ['not_deployed', 'deploying', 'deployed', 'failed'];
    if (!validStatuses.includes(status as DeploymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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
    
    // Update the project's deployment status
    const updateData: {
      deployment_status: DeploymentStatus;
      deployment_url?: string;
    } = {
      deployment_status: status as DeploymentStatus
    };
    
    if (deploymentUrl) {
      updateData.deployment_url = deploymentUrl;
    }
    
    const { error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', session.user.id);
    
    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update deployment status' },
        { status: 500 }
      );
    }
    
    // Log the deployment status change in project history
    const { error: historyError } = await supabase
      .from('project_history')
      .insert({
        project_id: projectId,
        action: 'deployment_status_change',
        metadata: {
          timestamp: new Date().toISOString(),
          status,
          deployment_url: deploymentUrl
        }
      });
    
    if (historyError) {
      console.error('Error logging deployment status change:', historyError);
      // Continue even if logging fails
    }
    
    return NextResponse.json({
      success: true,
      status,
      deploymentUrl
    });
  } catch (error) {
    console.error('Error updating deployment status:', error);
    return NextResponse.json(
      { error: 'Failed to update deployment status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  try {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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
      .select('deployment_status, deployment_url')
      .eq('id', projectId)
      .eq('user_id', session.user.id)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      status: project.deployment_status || 'not_deployed',
      deploymentUrl: project.deployment_url
    });
  } catch (error) {
    console.error('Error fetching deployment status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment status' },
      { status: 500 }
    );
  }
}