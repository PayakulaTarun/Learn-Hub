import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { TutorialMetadata } from '../../types/content';
import { getAllTutorials } from '../../lib/contentLoader';
import { BookOpen, ArrowRight } from 'lucide-react'; // BookOpen is kept for fallback, ArrowRight is new

interface SubjectsPageProps {
  tutorials: TutorialMetadata[];
}

import { availableSubjects, iconMap } from '../../lib/navData';

export default function SubjectsPage({ tutorials }: SubjectsPageProps) {
  // Group tutorials by subject slug
  const grouped = tutorials.reduce((acc, tutorial) => {
    // Attempt to match subject title to slug or just use subject normalized
    const subjectSlug = tutorial.category?.toLowerCase() || 'general';
    if (!acc[subjectSlug]) {
      acc[subjectSlug] = [];
    }
    acc[subjectSlug].push(tutorial);
    return acc;
  }, {} as Record<string, TutorialMetadata[]>);

  return (
    <Layout>
      <Head>
        <title>All Curricula - Student Resource Hub</title>
        <meta
          name="description"
          content="Master the complete engineering stack with our high-fidelity, production-grade learning paths."
        />
      </Head>

      <div className="min-h-screen bg-ui-dark py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tighter">
              The Intelligence <span className="text-accent underline decoration-accent/30 underline-offset-8">Curriculum</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              Explore our comprehensive range of technical domains, designed to take you from foundation to production readiness.
            </p>
          </div>

          {/* Categories/Subjects */}
          {availableSubjects.map((subject) => {
            const tutorialList = grouped[subject.slug] || [];
            const Icon = iconMap[subject.icon] || BookOpen;
            const subjectId = subject.slug;

            return (
              <div key={subjectId} id={subjectId} className="mb-20 scroll-mt-32">
                <div className="flex items-center justify-between mb-8 border-b border-ui-border pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-ui-card rounded-2xl border border-ui-border shadow-soft relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Icon className="text-accent group-hover:scale-110 transition-transform" size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-text-primary tracking-tight">
                            {subject.label}
                        </h2>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
                            {subject.category} &bull; {tutorialList.length} Units
                        </p>
                    </div>
                  </div>
                  
                  {tutorialList.length === 0 && (
                    <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-black uppercase tracking-widest shadow-glow-rose-sm">
                        Coming Soon
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tutorialList.map((tutorial) => (
                    <Link
                      key={tutorial.slug}
                      href={`/subjects/${tutorial.slug}`}
                      className="group bg-ui-dark border border-ui-border p-8 rounded-3xl hover:border-accent/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full shadow-xl"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/10 transition-colors"></div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {tutorial.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-6">
                          {tutorial.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                        Incept Domain
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  ))}
                  
                  {tutorialList.length === 0 && (
                    <div className="col-span-full py-12 px-8 bg-ui-card/30 border border-dashed border-ui-border rounded-3xl text-center">
                        <p className="text-text-muted font-medium italic">Curriculum for this domain is currently being drafted by our engineering leads.</p>
                    </div>
                  )}
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
