import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '@/themes/styles/pages/blog-archive.css';
import { usePages } from '@/hooks/usePages';

const BlogPage = () => {
  const { school } = useSchool();
  const { pages } = usePages();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const blogArchiveStyle = school?.branding?.blogArchiveStyle || 'blog-archive-style-1';

  useEffect(() => {
    const fetchPosts = async () => {
      if (school) {
        setLoading(true);
        const allPosts = await sdk.get('blog_posts');
        const schoolPosts = allPosts.filter((p: any) => p.schoolId === school.id && p.status === 'published');
        setPosts(schoolPosts);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [school]);

  if (loading || !school) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`blog-archive-page ${blogArchiveStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Button asChild>
                  <Link to={`/${school?.slug}/blog/${post.slug}`}>Read More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BlogPage;