'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { useProjects } from '@/hooks/useProjects';

export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const router = useRouter();

  // Function to determine project stage and badge variant
  const getProjectStage = (project: any) => {
    if (project.deployment_url) {
      return { stage: 'Deployed', variant: 'success' as const };
    } else if (project.build_status === 'completed') {
      return { stage: 'Ready to Deploy', variant: 'warning' as const };
    } else if (project.idea_status === 'completed') {
      return { stage: 'Building', variant: 'info' as const };
    } else {
      return { stage: 'Idea Phase', variant: 'primary' as const };
    }
  };

  return (
    <>
      <Head>
        <title>Projects | NoFuss AI Coder</title>
        <meta name="description" content="Manage your NoFuss AI Coder projects" />
      </Head>
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and continue working on your website projects
            </p>
          </div>
          <Link href="/projects/new">
            <Button
              variant="primary"
              icon={<Icon name="plus" />}
              iconPosition="left"
            >
              Create New Project
            </Button>
          </Link>
        </div>
        
        {error && (
          <Card variant="bordered" className="mb-8 border-error/30 bg-error/5">
            <CardContent className="flex items-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-error">{error}</p>
            </CardContent>
          </Card>
        )}
        
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your projects...</p>
              </div>
            </CardContent>
          </Card>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const { stage, variant } = getProjectStage(project);
              return (
                <Card
                  key={project.id}
                  variant="elevated"
                  className="transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <Badge variant={variant}>{stage}</Badge>
                    </div>
                    {project.description && (
                      <CardDescription className="mt-2">{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-primary font-medium">
                          {stage === 'Deployed' ? '100%' :
                           stage === 'Ready to Deploy' ? '75%' :
                           stage === 'Building' ? '50%' : '25%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{
                            width: stage === 'Deployed' ? '100%' :
                                   stage === 'Ready to Deploy' ? '75%' :
                                   stage === 'Building' ? '50%' : '25%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex space-x-2 w-full">
                      <Link href={`/projects/${project.id}/idea`} className="flex-1">
                        <Button variant="primary" size="sm" fullWidth>
                          Continue
                        </Button>
                      </Link>
                      {project.deployment_url && (
                        <Link href={project.deployment_url} target="_blank" className="flex-1">
                          <Button variant="outline" size="sm" fullWidth icon={<Icon name="globe" size="sm" />}>
                            View Site
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card variant="elevated" className="border border-dashed border-gray-300 dark:border-gray-700">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-primary-light/20 dark:bg-primary-dark/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="rocket" size="lg" className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first project to get started with NoFuss AI Coder.
                Just describe your website idea, and we'll help you build it!
              </p>
              <Link href="/projects/new">
                <Button
                  variant="primary"
                  icon={<Icon name="plus" />}
                  iconPosition="left"
                >
                  Create New Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}