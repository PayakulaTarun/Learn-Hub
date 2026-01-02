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

export default function Layout({ children, title = 'Student Resource Hub', description = 'Master web development with comprehensive tutorials' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="web development, engineering, coding, html, css, javascript, react, student resources, programming tutorials, learn to code" />
        <meta name="author" content="Student Resource Hub" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/logo.png" type="image/png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://student-resource-hub-a758a.web.app/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://student-resource-hub-a758a.web.app/logo.png" />
        <meta property="og:site_name" content="Student Resource Hub" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://student-resource-hub-a758a.web.app/" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://student-resource-hub-a758a.web.app/logo.png" />
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
