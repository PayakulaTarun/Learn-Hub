import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { TutorialMetadata } from '../../types/content';
import { getAllTutorials } from '../../lib/contentLoader';
import { BookOpen, Code, Database, Cloud, Smartphone, Wrench, Globe } from 'lucide-react';

interface SubjectsPageProps {
  tutorials: TutorialMetadata[];
}

const categoryIcons: Record<string, any> = {
  javascript: Code,
  python: Code,
  html: Globe,
  css: Wrench,
  java: Code,
  git: Cloud,
  django: Wrench,
  mysql: Database,
  mongodb: Database,
  'web development': Globe,
  frontend: Code,
  backend: Wrench,
};

const categoryColors: Record<string, string> = {
  javascript: 'bg-yellow-500',
  python: 'bg-blue-500',
  html: 'bg-orange-600',
  css: 'bg-blue-400',
  java: 'bg-red-500',
  git: 'bg-gray-700',
  django: 'bg-green-700',
  mysql: 'bg-blue-600',
  mongodb: 'bg-green-500',
  'web development': 'bg-orange-600',
  frontend: 'bg-blue-500',
  backend: 'bg-green-500',
};

export default function SubjectsPage({ tutorials }: SubjectsPageProps) {
  // Group tutorials by subject
  const grouped = tutorials.reduce((acc, tutorial) => {
    const subject = tutorial.subject || 'General';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(tutorial);
    return acc;
  }, {} as Record<string, TutorialMetadata[]>);

  return (
    <Layout>
      <Head>
        <title>All Subjects - LearnHub</title>
        <meta name="description" content="Browse all available technology tutorials and masterclasses" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              All Subjects
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master modern technologies with comprehensive masterclasses and hands-on examples
            </p>
          </div>

          {/* Categories/Subjects */}
          {Object.entries(grouped).map(([subject, tutorialList]) => {
             const subjectKey = subject.toLowerCase();
            const Icon = categoryIcons[subjectKey] || BookOpen;
            const colorClass = categoryColors[subjectKey] || 'bg-gray-500';

            return (
              <div key={subject} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`${colorClass} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    {subject}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorialList.map((tutorial) => (
                    <Link
                      key={tutorial.slug}
                      href={`/subjects/${tutorial.slug}`}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#4A90E2]"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4A90E2] transition">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {tutorial.description}
                        </p>
                      </div>
                      <div className="px-6 pb-6">
                        <div className="flex items-center text-[#4A90E2] font-medium text-sm group-hover:gap-2 transition-all">
                          Start Learning
                          <span className="ml-1 group-hover:ml-0 transition-all">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {tutorials.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No tutorials available</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tutorials = getAllTutorials();

  return {
    props: {
      tutorials,
    },
  };
};
