import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import Head from 'next/head';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | NoFuss AI Coder</title>
        <meta name="description" content="Create a new NoFuss AI Coder account" />
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </>
  );
}