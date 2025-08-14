import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, BookOpen, Search, Filter, ArrowRight, FileText, Tag, Eye, ThumbsUp } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';




interface KnowledgebaseArticle {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  status: 'published' | 'draft';
  featured: boolean;
  helpful: number;
  views: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  lastUpdated: string;
  publishedAt: string;
  relatedArticles: string[];
  attachments: string[];
  createdAt: string;
  updatedAt?: string;
}

const KnowledgebasePage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<KnowledgebaseArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgebaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);

  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'kb-archive-style-1': 'template-style-1',
      'kb-archive-style-2': 'template-style-2',
      'kb-archive-style-3': 'template-style-3',
      'kb-archive-style-4': 'template-style-4',
      'kb-archive-style-5': 'template-style-5',
      'kb-archive-style-6': 'template-style-6',
      'kb-archive-style-7': 'template-style-7',
      'kb-archive-style-8': 'template-style-8',
      'kb-archive-style-9': 'template-style-9',
      'kb-archive-style-10': 'template-style-10',
      'kb-archive-style-11': 'template-style-11',
      'kb-archive-style-12': 'template-style-12',
      'kb-archive-style-13': 'template-style-13',
      'kb-archive-style-14': 'template-style-14',
      'kb-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const kbArchiveStyle = school?.kbArchiveStyle || 'kb-archive-style-1';
  const templateStyle = getTemplateStyle(kbArchiveStyle);
  const articlesPerPage = 12;

  useEffect(() => {
    const fetchArticles = async () => {
      if (school) {
        setLoading(true);
        try {
          const allArticles = await sdk.get<KnowledgebaseArticle>('knowledgebase');
          const schoolArticles = allArticles.filter((a: KnowledgebaseArticle) =>
            a.schoolId === school.id && a.status === 'published'
          );
          setArticles(schoolArticles);

          const uniqueCategories = Array.from(
            new Set(schoolArticles.map(article => article.category).filter(Boolean))
          );
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Failed to fetch knowledgebase articles:', error);
          setArticles([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchArticles();
  }, [school]);

  useEffect(() => {
    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return b.views - a.views;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'readTime':
          return a.estimatedReadTime - b.estimatedReadTime;
        case 'newest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search knowledgebase..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select
        value={selectedDifficulty}
        onChange={(e) => setSelectedDifficulty(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">By Title</option>
        <option value="popular">Most Popular</option>
        <option value="helpful">Most Helpful</option>
        <option value="readTime">By Read Time</option>
      </select>
    </div>
  );

  const renderArticleCard = (article: KnowledgebaseArticle, index?: number) => {
    return (
      <article key={article.id} className="post-card">
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <FileText className="h-4 w-4" />
              <span>{article.difficulty}</span>
            </div>
            <div className="post-meta-item">
              <Clock className="h-4 w-4" />
              <span>{article.estimatedReadTime} min read</span>
            </div>
            <div className="post-meta-item">
              <Eye className="h-4 w-4" />
              <span>{article.views} views</span>
            </div>
            <div className="post-meta-item">
              <ThumbsUp className="h-4 w-4" />
              <span>{article.helpful} helpful</span>
            </div>
            <div className="post-meta-item">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
          <span className="post-category">{article.category}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/knowledgebase/${article.id}`}>
              {article.title}
            </Link>
          </h2>
          <p className="post-excerpt">{article.excerpt}</p>
          <div className="article-details">
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Last Updated:</strong> {formatDate(article.lastUpdated)}</p>
            {article.tags && article.tags.length > 0 && (
              <div className="tags">
                <Tag className="h-4 w-4" />
                <span>{article.tags.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
          <Link to={`/${schoolSlug}/knowledgebase/${article.id}`} className="read-more">
            Read Article <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">Knowledge Base</h1>
          <p className="archive-description">
            Find answers, guides, and helpful resources for students and staff
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedArticles.map((article, index) => renderArticleCard(article, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default KnowledgebasePage;
