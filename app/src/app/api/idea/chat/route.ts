import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { sendMessageToOpenRouter } from '@/lib/openrouter/client';

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
    const { projectId, messages, isSummaryRequest = false } = body;
    
    if (!projectId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Check if the project exists and belongs to the user
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
    
    // Send the message to OpenRouter
    const response = await sendMessageToOpenRouter(messages);
    
    // Save the message history to the project
    const { error: chatHistoryError } = await supabase
      .from('project_history')
      .insert({
        project_id: projectId,
        action: isSummaryRequest ? 'generate_summary' : 'chat_message',
        metadata: {
          messages: messages.slice(-2), // Save only the last user message and response
          timestamp: new Date().toISOString()
        }
      });
    
    if (chatHistoryError) {
      console.error('Error saving chat history:', chatHistoryError);
      // Continue even if saving history fails
    }
    
    // If this is a summary request, update the project with the summary
    if (isSummaryRequest) {
      try {
        // Try to parse the response as JSON
        const jsonResponse = JSON.parse(response);
        
        // Update the project with the summary
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            idea_summary: jsonResponse,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId)
          .eq('user_id', session.user.id);
        
        if (updateError) {
          console.error('Error updating project with summary:', updateError);
          // Continue even if update fails
        }
      } catch (jsonError) {
        console.error('Error parsing summary as JSON:', jsonError);
        // Continue even if parsing fails
      }
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}