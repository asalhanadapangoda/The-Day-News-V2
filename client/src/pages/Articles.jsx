import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, articlesRes] = await Promise.all([
          api.get('/categories'),
          api.get(currentCategory ? `/articles?category=${currentCategory}` : '/articles')
        ]);
        
        setCategories(catsRes.data);
        setArticles(articlesRes.data);
      } catch (error) {
        console.error("Error loading articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCategory]);

  const handleCategoryChange = (slug) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 text-glow">Latest Articles</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          In-depth analysis, breaking news, and featured stories from our global correspondents.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
            currentCategory === '' 
              ? 'bg-primary border-primary text-white' 
              : 'bg-transparent border-white/20 text-gray-300 hover:border-primary hover:text-white'
          }`}
        >
          All News
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
              currentCategory === cat.slug 
                ? 'bg-primary border-primary text-white' 
                : 'bg-transparent border-white/20 text-gray-300 hover:border-primary hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/5 rounded-xl border border-white/10">
          No articles found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link key={article._id} to={`/articles/${article.slug}`} className="group glass-card overflow-hidden block flex flex-col h-full hover-glow">
              <div className="relative h-48 overflow-hidden">
                <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {article.category && (
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
                    {article.category.name}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
                  <span>{format(new Date(article.publishDate), 'MMM dd, yyyy')}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{article.excerpt}</p>
                <div className="text-xs text-primary font-semibold uppercase tracking-wider mt-auto group-hover:text-white transition-colors">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
