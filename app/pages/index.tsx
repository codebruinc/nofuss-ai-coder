import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>NoFuss AI Coder | Build Websites with AI Assistance</title>
        <meta name="description" content="NoFuss AI Coder helps beginners create beautiful websites without coding experience. Just describe what you want, and our AI will help you build it." />
      </Head>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Build Your Website with <span className="text-accent">AI</span> Assistance
              </h1>
              <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-100">
                NoFuss AI Coder helps beginners create beautiful websites without coding experience.
                Just describe what you want, and our AI will help you build it.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                  <Button
                    variant="accent"
                    size="lg"
                    className="font-semibold"
                    icon={<Icon name="arrow-right" />}
                    iconPosition="right"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hero Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our three-step process makes website creation accessible to everyone, regardless of technical experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <Card variant="elevated" className="text-center transform transition-all duration-300 hover:-translate-y-2">
                <CardContent>
                  <div className="bg-primary-light/20 dark:bg-primary-dark/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="idea" size="lg" className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">1. Idea Clarification</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Describe your website vision to our AI. It will ask questions to understand your needs and create a detailed project plan.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="text-center transform transition-all duration-300 hover:-translate-y-2">
                <CardContent>
                  <div className="bg-secondary-light/20 dark:bg-secondary-dark/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="build" size="lg" className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">2. AI-Assisted Building</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use our integrated coding environment with AI assistance to build your website. The AI helps with code, design, and functionality.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="text-center transform transition-all duration-300 hover:-translate-y-2">
                <CardContent>
                  <div className="bg-accent-light/20 dark:bg-accent-dark/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="deploy" size="lg" className="text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">3. Guided Deployment</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get step-by-step guidance to deploy your website to the internet. We'll help you choose a hosting provider and go live.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Website?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already created stunning websites with NoFuss AI Coder.
            </p>
            <Link href="/auth/register">
              <Button
                variant="accent"
                size="lg"
                className="font-semibold"
                icon={<Icon name="rocket" />}
                iconPosition="left"
              >
                Start Building Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}