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
  frontend: Code,
  backend: Wrench,
  databases: Database,
  devops: Cloud,
  mobile: Smartphone,
  'web development': Globe,
};

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500',
  backend: 'bg-green-500',
  databases: 'bg-purple-500',
  devops: 'bg-orange-500',
  mobile: 'bg-pink-500',
  'web development': 'bg-orange-600',
};

export default function SubjectsPage({ tutorials }: SubjectsPageProps) {
  // Group tutorials by category
  const grouped = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
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

          {/* Categories */}
          {Object.entries(grouped).map(([category, tutorialList]) => {
            const Icon = categoryIcons[category] || BookOpen;
            const colorClass = categoryColors[category] || 'bg-gray-500';

            return (
              <div key={category} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`${colorClass} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">
                    {category}
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
