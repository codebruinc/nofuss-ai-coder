import React from 'react';
import { LoginForm } from '../components/LoginForm';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | NoFuss AI Coder</title>
        <meta name="description" content="Sign in to your NoFuss AI Coder account" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </>
  );
}