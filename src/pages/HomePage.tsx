import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ArrowRight, Clock } from "lucide-react";

export function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);

  useEffect(() => {
    fetch("/api/articles?status=published")
      .then(r => r.json())
      .then(data => {
        if (data.length > 0) {
          setFeatured(data[0]);
          setArticles(data.slice(1));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Blog - Bitlance" description="Insights, engineering updates, and thoughtful guides from the team at Bitlance." />
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Simple Enterprise Hero Header */}
        <div className="text-center md:text-left mb-16 lg:mb-24">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            The Bitlance Blog
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl font-light">
            Insights, engineering updates, and thoughtful guides on borderless work, Bitcoin, and product development from the team at Bitlance.
          </p>
        </div>

        {/* Featured Article Layout */}
        {featured && (
          <div className="mb-20 lg:mb-32 group">
            <Link to={`/article/${featured.slug || featured.id}`} className="block">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 font-semibold text-brand-600 mb-6 text-xs uppercase tracking-wider">
                    Featured
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-brand-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                    {featured.subtitle || featured.content?.replace(/<[^>]+>/g, '').substring(0, 200)}...
                  </p>
                  <div className="flex items-center text-sm font-medium text-gray-500 gap-4">
                    <span>{new Date(featured.published_at || featured.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    {featured.reading_time && (
                      <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                        <Clock className="w-4 h-4" />
                        <span>{featured.reading_time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                  <img 
                    src={featured.featured_image || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"} 
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Latest Articles Grid */}
        <div className="mb-12 border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Latest from the team</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {articles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug || article.id}`} className="group flex flex-col h-full">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-6 border border-gray-100 shadow-sm">
                <img 
                  src={article.featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                <span>{new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
                 {article.subtitle || article.content?.replace(/<[^>]+>/g, '').substring(0, 120)}...
              </p>
              <div className="flex items-center gap-1.5 text-brand-600 font-medium text-sm group-hover:gap-2 transition-all mt-auto">
                Read article <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
