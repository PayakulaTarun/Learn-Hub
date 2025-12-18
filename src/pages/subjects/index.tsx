import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { TutorialMetadata } from '../../types/content';
import { getAllTutorials } from '../../lib/contentLoader';
import { BookOpen, Code, Database, Cloud, Smartphone, Wrench, Globe, BarChart, Network } from 'lucide-react';

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
  angular: Code,
  'data science': BarChart,
  'data structures': Network,
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
  angular: 'bg-red-600',
  'data science': 'bg-purple-600',
  'data structures': 'bg-indigo-600',
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

  const sortedSubjects = Object.entries(grouped).sort(([a], [b]) => {
    const order = [
      'html',
      'css',
      'javascript',
      'data structures',
      'bootstrap',
      'typescript',
      'react',
      'angular',
      'next.js',
      'java',
      'python',
      'data science',
      'mysql',
      'mongodb',
      'git',
      'django',
    ];
    const indexA = order.indexOf(a.toLowerCase());
    const indexB = order.indexOf(b.toLowerCase());

    // If both are in the list, sort by index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only A is in list, A comes first
    if (indexA !== -1) return -1;
    // If only B is in list, B comes first
    if (indexB !== -1) return 1;
    // If neither, sort alphabetically
    return a.localeCompare(b);
  });

  return (
    <Layout>
      <Head>
        <title>All Subjects - LearnHub</title>
        <meta
          name="description"
          content="Browse all available technology tutorials and masterclasses"
        />
      </Head>

      {/* Secondary Web Navigation (Sticky) */}
      <div className="sticky top-16 z-40 bg-ui-card/95 backdrop-blur-sm border-b border-ui-border shadow-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-1 overflow-x-auto py-3 no-scrollbar">
            {sortedSubjects.map(([subject]) => (
              <a
                key={subject}
                href={`#${subject.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-1.5 text-sm font-medium text-text-secondary hover:text-accent hover:bg-ui-dark rounded-full transition-all whitespace-nowrap"
              >
                {subject}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-ui-dark py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              All Subjects
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Master modern technologies with comprehensive masterclasses and
              hands-on examples
            </p>
          </div>

          {/* Categories/Subjects */}
          {sortedSubjects.map(([subject, tutorialList]) => {
            const subjectKey = subject.toLowerCase();
            const Icon = categoryIcons[subjectKey] || BookOpen;
            const colorClass = categoryColors[subjectKey] || 'bg-gray-500';
            const subjectId = subject.toLowerCase().replace(/\s+/g, '-');

            return (
              <div key={subject} id={subjectId} className="mb-16 scroll-mt-32">
                <div className="flex items-center gap-3 mb-8 border-b border-ui-border pb-4">
                  <div className={`${colorClass} p-3 rounded-lg bg-opacity-20`}>
                    <Icon className="text-text-primary" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary capitalize">
                    {subject}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorialList.map((tutorial) => (
                    <Link
                      key={tutorial.slug}
                      href={`/subjects/${tutorial.slug}`}
                      className="group bg-ui-card rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 overflow-hidden border border-ui-border hover:border-accent"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition">
                          {tutorial.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {tutorial.description}
                        </p>
                      </div>
                      <div className="px-6 pb-6">
                        <div className="flex items-center text-accent font-medium text-sm group-hover:gap-2 transition-all">
                          Start Learning
                          <span className="ml-1 group-hover:ml-0 transition-all">
                            →
                          </span>
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
              <BookOpen className="mx-auto text-text-muted mb-4" size={64} />
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                No tutorials available
              </h3>
              <p className="text-text-secondary">
                Check back soon for new content!
              </p>
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
