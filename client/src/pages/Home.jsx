import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlayCircle, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import AIChatBot from '../components/AIChatBot';
import Skeleton from '../components/Skeleton';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    settings: null,
    recentEpisodes: [],
    recentArticles: [],
    categories: [],
    featuredProgram: null,
    featuredEpisodes: [],
    ads: [],
    heroes: [],
    allPrograms: [],
    allEpisodes: [],
  });
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (data.heroes.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % data.heroes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data.heroes]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          settingsRes,
          episodesRes,
          articlesRes,
          categoriesRes,
          programsRes,
          adsRes,
          heroesRes,
        ] = await Promise.all([
          api.get('/settings'),
          api.get('/episodes'),
          api.get('/articles'),
          api.get('/categories'),
          api.get('/programs'),
          api.get('/ads'),
          api.get('/heroes'),
        ]);

        const settings = settingsRes.data;
        const allEpisodes = Array.isArray(episodesRes.data) ? episodesRes.data : [];
        const allPrograms = Array.isArray(programsRes.data) ? programsRes.data : [];
        const articles = Array.isArray(articlesRes.data) ? articlesRes.data : [];
        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        const ads = Array.isArray(adsRes.data) ? adsRes.data : [];
        const heroes = Array.isArray(heroesRes.data) ? heroesRes.data : [];

        // Extract featured program info
        const featuredProgram = allPrograms.find(p => p.isFeatured) || allPrograms[0];
        const featuredEpisodes = featuredProgram
          ? allEpisodes.filter(e => e.program?._id === featuredProgram._id).slice(0, 3)
          : [];

        setData({
          settings,
          recentEpisodes: allEpisodes.slice(0, 3), // Get latest 3 overall
          recentArticles: articles.slice(0, 4), // Get latest 4 articles
          categories,
          featuredProgram,
          featuredEpisodes,
          ads,
          heroes,
          allPrograms,
          allEpisodes,
        });
      } catch (error) {
        console.error("Error loading home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        {/* Hero Skeleton */}
        <div className="h-[80vh] min-h-[600px] w-full bg-white/5 animate-pulse relative">
           <div className="absolute inset-0 bg-gradient-to-t from-[#0c0014] to-transparent"></div>
           <div className="absolute bottom-16 left-8 md:bottom-24 md:left-16 space-y-6 w-full max-w-2xl px-4">
              <div className="h-12 md:h-16 bg-white/10 rounded w-full md:w-3/4"></div>
              <div className="h-6 bg-white/5 rounded w-1/2"></div>
              <div className="h-14 bg-white/10 rounded-full w-40"></div>
           </div>
        </div>
        
        {/* Grid Skeletons */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
           {/* Ads Skeleton */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="h-40 bg-white/5 rounded-xl animate-pulse"></div>
              <div className="h-40 bg-white/5 rounded-xl animate-pulse"></div>
           </div>

           {/* Episodes Skeleton */}
           <div>
              <div className="h-10 bg-white/10 rounded w-48 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} type="episode" />)}
              </div>
           </div>
           
           {/* Articles Skeleton */}
           <div>
              <div className="h-10 bg-white/10 rounded w-64 mb-10 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} type="article" />)}
              </div>
           </div>

           {/* Posters Skeleton */}
           <div>
              <div className="h-10 bg-white/10 rounded w-48 mb-10 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => <Skeleton key={i} type="poster" />)}
              </div>
           </div>
        </div>
      </div>
    );
  }

  const getAdsByPlacement = (placement) => data.ads.filter(ad => ad.placement === placement);
  const homeTopAds = getAdsByPlacement('home_top');
  const homeMiddleAds = getAdsByPlacement('home_middle');

  return (
    <div className="w-full">
      {/* 1. Hero Section (Dynamic Slider) */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        {data.heroes.length > 0 ? (
          data.heroes.map((hero, index) => (
            <div
              key={hero._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              style={{ backgroundImage: `url(${hero.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0014]/90 via-[#0c0014]/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c0014]/80 via-[#0c0014]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto h-full flex flex-col justify-end">
                <div className="max-w-3xl space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight text-glow drop-shadow-lg">
                    {hero.title}
                  </h1>
                  {hero.subtitle && (
                    <p className="text-white text-sm font-bold uppercase tracking-widest drop-shadow-md">
                      {hero.subtitle}
                    </p>
                  )}
                  {hero.linkUrl && (
                    <div className="pt-4">
                      <Link to={hero.linkUrl}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all hover-glow">
                        <PlayCircle size={24} />
                        <span>Watch Now</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://placehold.co/1920x1080/08000f/333?text=Hero+Banner')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0014]/90 via-[#0c0014]/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0014]/80 via-[#0c0014]/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
              <div className="max-w-3xl space-y-6">
                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  Featured Insight
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight text-glow">
                  Welcome to The Day News Global
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Watch the latest programs and read breaking media features from around the entire world.
                </p>
                <div>
                  <Link to={'/programs'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all hover-glow">
                    <PlayCircle size={24} />
                    <span>Watch Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slider Controls */}
        {data.heroes.length > 1 && (
          <div className="absolute bottom-8 right-8 z-20 flex gap-2">
            {data.heroes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-primary scale-125' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Top Ad Placement */}
      {homeTopAds && homeTopAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className={`grid grid-cols-1 ${homeTopAds.length > 1 ? 'md:grid-cols-2' : ''} gap-8`}>
            {homeTopAds.slice(0, 2).map((ad) => (
              <a key={ad._id} href={ad.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full group">
                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl transition-all group-hover:border-primary/30">
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-contain" loading="lazy" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] text-primary/80 uppercase tracking-widest border border-white/10">
                    Sponsored
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 3. Recent Episodes */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Recent Releases
          </h2>
          <Link to="/programs" className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm uppercase tracking-wider font-semibold">
            View All Programs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.recentEpisodes.map(episode => (
            <Link key={episode._id} to={`/programs/${episode.program?.slug}`} className="group glass-card overflow-hidden block">
              <div className="relative aspect-video overflow-hidden">
                <img src={episode.thumbnailImage} alt={episode.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <PlayCircle size={48} className="text-white/80 group-hover:text-white transform group-hover:scale-110 transition-all drop-shadow-lg" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{episode.program?.title}</div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{episode.title}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Calendar size={14} /> {format(new Date(episode.publishDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Recent Articles */}
      <section className="bg-black/20 backdrop-blur-sm py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
              Latest News & Stories
            </h2>
            <Link to="/articles" className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm uppercase tracking-wider font-semibold">
              Read All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.recentArticles.map(article => (
              <Link key={article._id} to={`/articles/${article.slug}`} className="group bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-primary/50 transition-colors flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {article.category && (
                    <div className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
                      {article.category.name}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{article.excerpt}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-2 mt-auto">
                    {format(new Date(article.publishDate), 'MMM dd, yyyy')} • {article.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. All Programs Poster Section */}
      {data.allPrograms && data.allPrograms.filter(p => p.posterImage).length > 0 && (
        <section className="py-16 border-y border-white/5 bg-gradient-to-b from-[#0c0014] to-[#0a0012]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Our Programs
              </h2>
              <Link to="/programs" className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm uppercase tracking-wider font-semibold">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.allPrograms.filter(p => p.posterImage).map(prog => (
                <Link
                  key={prog._id}
                  to={`/programs/${prog.slug}`}
                  className="group relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-2 duration-500 bg-[#1a1a1a]"
                  style={{ aspectRatio: '3/4.5' }}
                >
                  <img
                    src={prog.posterImage}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-black text-xl md:text-2xl leading-tight drop-shadow-lg group-hover:text-primary transition-colors">
                      {prog.title}
                    </h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Explore Program
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Middle Ad Placement */}
      {homeMiddleAds && homeMiddleAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeMiddleAds.slice(0, 2).map((ad) => (
              <a key={ad._id} href={ad.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full group">
                <div className="h-40 md:h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black/20 backdrop-blur-sm relative group-hover:border-primary/30 transition-all">
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] text-primary/80 uppercase tracking-widest border border-white/10">
                    Sponsored
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 7. Per-Program Latest Episodes */}
      {data.allPrograms.length > 0 && data.allEpisodes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">
          {data.allPrograms.map(prog => {
            const progEpisodes = data.allEpisodes
              .filter(e => e.program?._id === prog._id)
              .slice(0, 3);
            if (progEpisodes.length === 0) return null;
            return (
              <div key={prog._id}>
                {/* Program header */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-white">{prog.title}</h2>
                  </div>
                  <Link
                    to={`/programs/${prog.slug}`}
                    className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm uppercase tracking-wider font-semibold whitespace-nowrap"
                  >
                    View All <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Episode cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {progEpisodes.map(episode => (
                    <div key={episode._id} className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all shadow-lg flex flex-col group">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                          <img
                            src={episode.thumbnailImage}
                            alt={episode.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <PlayCircle size={44} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-lg" />
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {episode.title}
                        </h3>
                        {episode.description && (
                          <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                            {episode.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(episode.publishDate), 'MMM dd, yyyy')}
                          </p>
                          <Link
                            to={`/programs/${prog.slug}`}
                            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1 hover-glow"
                          >
                            <PlayCircle size={13} /> View Full Episode
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}


      <AIChatBot />
    </div>
  );
};

export default Home;
