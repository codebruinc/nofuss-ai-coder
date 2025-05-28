import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/ui/Navigation';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'NoFuss AI Coder',
  description: 'A beginner-focused, AI-assisted website builder',
  keywords: 'AI, website builder, no-code, beginner-friendly, web development',
  authors: [{ name: 'NoFuss AI Team' }],
  openGraph: {
    title: 'NoFuss AI Coder',
    description: 'Build websites easily with AI assistance',
    url: 'https://nofuss-ai-coder.vercel.app',
    siteName: 'NoFuss AI Coder',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="flex-grow animate-fade-in">
              {children}
            </main>
            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 border-t border-gray-700">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Logo size="md" className="mb-4" />
                    <p className="text-gray-400 dark:text-gray-300 text-sm">
                      Building websites made simple with AI assistance. Perfect for beginners and professionals alike.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                      <li>
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                      </li>
                      <li>
                        <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                      </li>
                      <li>
                        <a href="/auth/login" className="hover:text-primary transition-colors">Login</a>
                      </li>
                      <li>
                        <a href="/auth/register" className="hover:text-primary transition-colors">Sign Up</a>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Our Process</h3>
                    <ul className="space-y-2 text-gray-400 dark:text-gray-300">
                      <li className="flex items-center">
                        <Icon name="idea" size="sm" className="mr-2 text-primary" />
                        <span>Idea Clarification</span>
                      </li>
                      <li className="flex items-center">
                        <Icon name="build" size="sm" className="mr-2 text-secondary" />
                        <span>AI-Assisted Building</span>
                      </li>
                      <li className="flex items-center">
                        <Icon name="deploy" size="sm" className="mr-2 text-accent" />
                        <span>Guided Deployment</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                  <div className="text-gray-400 dark:text-gray-300 text-sm mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} NoFuss AI Coder. All rights reserved.
                  </div>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
