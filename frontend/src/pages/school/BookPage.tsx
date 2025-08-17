import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';

const BookPage = () => {
  const { bookId } = useParams();
  const { school } = useSchool();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (school && bookId) {
        setLoading(true);
        const currentBook = await sdk.getItem('elibrary', bookId);
        setBook(currentBook);
        setLoading(false);
      }
    };
    fetchBook();
  }, [school, bookId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  return (
    <div>
      <SchoolHeader school={school} pages={[]} />
      <main className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <hr className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
            <Button asChild className="mt-4">
              <a href={book.fileUrl} target="_blank" rel="noopener noreferrer">Download Book</a>
            </Button>
          </CardContent>
        </Card>
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default BookPage;