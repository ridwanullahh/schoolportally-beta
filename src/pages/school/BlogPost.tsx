import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const BlogPostPage = () => {
  const { schoolSlug, postSlug } = useParams();
  const { school } = useSchool();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (school && postSlug) {
        setLoading(true);
        const allPosts = await sdk.get('blog_posts');
        const currentPost = allPosts.find((p: any) => p.schoolId === school.id && p.slug === postSlug);
        setPost(currentPost);
        setLoading(false);
      }
    };
    fetchPost();
  }, [school, postSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BlogPostPage;