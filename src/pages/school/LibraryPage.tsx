import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const LibraryPage = () => {
  const { school } = useSchool();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (school) {
        setLoading(true);
        const allBooks = await sdk.get('elibrary');
        const schoolBooks = allBooks.filter((b: any) => b.schoolId === school.id && b.status === 'published');
        setBooks(schoolBooks);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [school]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">E-Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.length > 0 ? books.map((book: any) => (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>by {book.author}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/${school?.slug}/library/${book.id}`}>
                  <Button variant="link">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          )) : <p className="col-span-full text-center">No books available in the library.</p>}
        </div>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default LibraryPage;