'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { Logo } from './Logo';
import { Icon } from './Icon';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't show navigation on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }
  
  const isHomePage = pathname === '/';
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo size="md" className="text-primary" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-6">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors ${
                        isActive('/dashboard') ? 'text-primary dark:text-primary-light font-medium' : ''
                      }`}
                    >
                      <Icon name="code" size="sm" className="mr-1.5" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => signOut()}
                      isLoading={isLoading}
                      size="sm"
                    >
                      Sign Out
                    </Button>
                  </li>
                </>
              ) : isHomePage ? (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register">
                      <Button variant="primary" size="sm">Sign Up</Button>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    Home
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-4 pt-4">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className={`block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light ${
                        isActive('/dashboard') ? 'text-primary dark:text-primary-light font-medium' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      isLoading={isLoading}
                      size="sm"
                      fullWidth
                    >
                      Sign Out
                    </Button>
                  </li>
                </>
              ) : isHomePage ? (
                <>
                  <li>
                    <Link
                      href="/auth/login"
                      className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" fullWidth>Sign Up</Button>
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/"
                    className="block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};