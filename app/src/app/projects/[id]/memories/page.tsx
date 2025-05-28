'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMemories } from '@/hooks/useMemories';
import { useMemoryCollections } from '@/hooks/useMemoryCollections';
import { useMemoryPreferences } from '@/hooks/useMemoryPreferences';
import { Memory, MemoryType, ProjectStage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface MemoryBankPageProps {
  params: {
    id: string;
  };
}

export default function MemoryBankPage({ params }: MemoryBankPageProps) {
  const projectId = params.id;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { preferences, isLoading: preferencesLoading } = useMemoryPreferences();
  const [activeView, setActiveView] = useState<'timeline' | 'category' | 'stage'>('timeline');
  const [selectedType, setSelectedType] = useState<MemoryType | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<ProjectStage | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all memories for the project
  const { 
    memories, 
    isLoading: memoriesLoading, 
    error: memoriesError,
    refreshMemories,
    pinMemory,
    deleteMemory
  } = useMemories({ 
    projectId,
    ...(selectedType !== 'all' ? { type: selectedType } : {}),
    ...(selectedStage !== 'all' ? { stage: selectedStage } : {}),
    ...(selectedTag ? { tag: selectedTag } : {})
  });

  // Fetch collections for the project
  const {
    collections,
    isLoading: collectionsLoading,
    error: collectionsError
  } = useMemoryCollections({ projectId });

  // Set the active view based on user preferences
  useEffect(() => {
    if (preferences && !preferencesLoading) {
      setActiveView(preferences.default_view);
    }
  }, [preferences, preferencesLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Filter memories based on search query
  const filteredMemories = searchQuery
    ? memories.filter(memory => 
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(memory.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memories;

  // Group memories by date for timeline view
  const groupedByDate = filteredMemories.reduce((groups, memory) => {
    const date = new Date(memory.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(memory);
    return groups;
  }, {} as Record<string, Memory[]>);

  // Group memories by type for category view
  const groupedByType = filteredMemories.reduce((groups, memory) => {
    if (!groups[memory.memory_type]) {
      groups[memory.memory_type] = [];
    }
    groups[memory.memory_type].push(memory);
    return groups;
  }, {} as Record<string, Memory[]>);

  // Group memories by stage for stage view
  const groupedByStage = filteredMemories.reduce((groups, memory) => {
    if (!groups[memory.stage]) {
      groups[memory.stage] = [];
    }
    groups[memory.stage].push(memory);
    return groups;
  }, {} as Record<string, Memory[]>);

  // Handle memory pin/unpin
  const handleTogglePin = async (memory: Memory) => {
    await pinMemory(memory.id, !memory.is_pinned);
    refreshMemories();
  };

  // Handle memory deletion
  const handleDeleteMemory = async (memoryId: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(memoryId);
      refreshMemories();
    }
  };

  // Render memory card
  const renderMemoryCard = (memory: Memory) => (
    <Card key={memory.id} className="p-4 mb-4 relative">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{memory.title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTogglePin(memory)}
            className="text-gray-500 hover:text-yellow-500"
            title={memory.is_pinned ? "Unpin" : "Pin"}
          >
            {memory.is_pinned ? "📌" : "📍"}
          </button>
          <button 
            onClick={() => handleDeleteMemory(memory.id)}
            className="text-gray-500 hover:text-red-500"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {new Date(memory.created_at).toLocaleString()}
      </div>
      <div className="mb-2">
        {renderMemoryContent(memory.content)}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge>{memory.memory_type}</Badge>
        <Badge>{memory.stage}</Badge>
        {memory.tags.map(tag => (
          <Badge 
            key={tag} 
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`cursor-pointer ${selectedTag === tag ? 'bg-blue-600' : 'bg-gray-200 text-gray-800'}`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );

  // Render memory content based on type
  const renderMemoryContent = (content: any) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    
    if (content.message) {
      return <p>{content.message}</p>;
    }
    
    if (content.summary) {
      return (
        <div>
          <p><strong>Purpose:</strong> {content.summary.purpose}</p>
          <p><strong>Target Audience:</strong> {content.summary.target_audience}</p>
          <p><strong>Key Features:</strong> {content.summary.key_features.join(', ')}</p>
        </div>
      );
    }
    
    return <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">{JSON.stringify(content, null, 2)}</pre>;
  };

  // Loading state
  if (authLoading || memoriesLoading || collectionsLoading || preferencesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (memoriesError || collectionsError) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500 mb-4">{memoriesError || collectionsError}</p>
        <Button onClick={() => router.push(`/projects/${projectId}`)}>
          Back to Project
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Memory Bank</h1>
        <Button onClick={() => router.push(`/projects/${projectId}`)}>
          Back to Project
        </Button>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded flex-grow"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MemoryType | 'all')}
            className="p-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="idea">Idea</option>
            <option value="build">Build</option>
            <option value="deploy">Deploy</option>
            <option value="user_preference">User Preference</option>
            <option value="project_evolution">Project Evolution</option>
          </select>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as ProjectStage | 'all')}
            className="p-2 border rounded"
          >
            <option value="all">All Stages</option>
            <option value="idea">Idea</option>
            <option value="build">Build</option>
            <option value="deploy">Deploy</option>
          </select>
        </div>
        {selectedTag && (
          <div className="mb-4">
            <Badge className="bg-blue-600">
              {selectedTag}
              <button 
                onClick={() => setSelectedTag(null)} 
                className="ml-2 text-white"
              >
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* View selector */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${activeView === 'timeline' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveView('timeline')}
        >
          Timeline
        </button>
        <button
          className={`px-4 py-2 ${activeView === 'category' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveView('category')}
        >
          By Type
        </button>
        <button
          className={`px-4 py-2 ${activeView === 'stage' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => setActiveView('stage')}
        >
          By Stage
        </button>
      </div>

      {/* Pinned memories */}
      {filteredMemories.some(memory => memory.is_pinned) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📌 Pinned Memories</h2>
          {filteredMemories
            .filter(memory => memory.is_pinned)
            .map(renderMemoryCard)}
        </div>
      )}

      {/* Memory collections */}
      {collections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <Card key={collection.id} className="p-4">
                <h3 className="text-lg font-semibold">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-2">{collection.description}</p>
                )}
                <Button 
                  onClick={() => router.push(`/projects/${projectId}/memories/collections/${collection.id}`)}
                  className="mt-2"
                >
                  View Collection
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Memory content based on selected view */}
      {activeView === 'timeline' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          {Object.keys(groupedByDate).length > 0 ? (
            Object.entries(groupedByDate)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, memories]) => (
                <div key={date} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">{date}</h3>
                  {memories.map(renderMemoryCard)}
                </div>
              ))
          ) : (
            <p className="text-gray-500">No memories found.</p>
          )}
        </div>
      )}

      {activeView === 'category' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">By Type</h2>
          {Object.keys(groupedByType).length > 0 ? (
            Object.entries(groupedByType).map(([type, memories]) => (
              <div key={type} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">{type}</h3>
                {memories.map(renderMemoryCard)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No memories found.</p>
          )}
        </div>
      )}

      {activeView === 'stage' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">By Stage</h2>
          {Object.keys(groupedByStage).length > 0 ? (
            Object.entries(groupedByStage).map(([stage, memories]) => (
              <div key={stage} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">{stage}</h3>
                {memories.map(renderMemoryCard)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No memories found.</p>
          )}
        </div>
      )}
    </div>
  );
}