import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const KnowledgebasePage = () => {
  const { school } = useSchool();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (school) {
        setLoading(true);
        const allArticles = await sdk.get('wiki_articles');
        const schoolArticles = allArticles.filter((a: any) => a.schoolId === school.id && a.status === 'published');
        setArticles(schoolArticles);
        setLoading(false);
      }
    };
    fetchArticles();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Knowledgebase</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? articles.map((article: any) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link to={`/${school?.slug}/knowledgebase/${article.id}`}>
                  <Button variant="link">Read Article</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No articles available in the knowledgebase.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default KnowledgebasePage;