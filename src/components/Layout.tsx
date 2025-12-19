import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import SubjectNavbar from './SubjectNavbar';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = 'LearnHub', description = 'Master web development with comprehensive tutorials' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <SubjectNavbar />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
}