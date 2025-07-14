import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/library.css';
import { Bookmark } from 'lucide-react';

interface LibrarySectionProps {
  section: Section;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({ section }) => {
  const { title, books } = section.content;
  const styleId = section.styleId || 'library-book-grid';

  const defaultBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://via.placeholder.com/200x250', bookmarked: true },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://via.placeholder.com/200x250', bookmarked: false },
    { title: '1984', author: 'George Orwell', cover: 'https://via.placeholder.com/200x250', bookmarked: false },
    { title: 'Pride and Prejudice', author: 'Jane Austen', cover: 'https://via.placeholder.com/200x250', bookmarked: true },
  ];

  const libraryBooks = books && books.length > 0 ? books : defaultBooks;

  const renderBook = (book: any, index: number) => {
    if (styleId === 'library-inline-bookmark') {
      return (
        <div key={index} className="book-item relative">
          <img src={book.cover} alt={book.title} className="book-cover" />
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author text-muted-foreground">{book.author}</p>
          <Bookmark className={`bookmark-icon ${book.bookmarked ? 'bookmarked' : ''}`} />
        </div>
      )
    }
    
    return (
      <div key={index} className="book-card">
        <img src={book.cover} alt={book.title} className="book-cover" />
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author text-muted-foreground">{book.author}</p>
      </div>
    );
  }

  return (
    <section className={`library-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="library-container grid grid-cols-2 md:grid-cols-4 gap-8">
          {libraryBooks.map(renderBook)}
        </div>
      </div>
    </section>
  );
};

export default LibrarySection;