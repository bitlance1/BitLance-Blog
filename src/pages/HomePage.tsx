import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  ArrowRight,
  Clock,
  ChevronDown,
  TrendingUp,
  Zap,
  Newspaper,
  FileText,
  Users,
  Briefcase,
  Lock,
  CheckCircle,
} from "lucide-react";

// Structured FAQ list targeting high-intent inquiries for SEO & AI Overviews
const HOMEPAGE_FAQS = [
  {
    question: "How do Bitcoin-native freelance payments work on BitLance?",
    answer: "On BitLance, work is organized into milestones. Before a freelancer begins working, the client funds a secure milestone-based Lightning escrow by creating and paying a Lightning invoice directly inside the Messages chat. When the milestone is successfully completed and verified, the client clicks 'Approve and Pay'. This automatically releases the escrowed sats directly to the freelancer's payout Lightning address, with no platform-side deductions from their earnings."
  },
  {
    question: "What are the benefits of using the Lightning Network for remote payroll?",
    answer: "The Lightning Network allows for instant, cross-border payments with near-zero transaction fees. Instead of waiting days for legacy wire transfers or paying high currency conversion fees, employers can run automated global payouts to freelancers worldwide instantly, settling in sats directly to their personal self-custodial wallets."
  },
  {
    question: "What are the platform fees and how do they work?",
    answer: "BitLance is highly developer-friendly: freelancers keep 100% of their agreed earnings—absolutely zero fees are deducted from their payouts. Instead, the client pays a flat 5% platform fee. The escrow invoice generated in the Messages chat itemizes this fee (for example, a 2,500 sat milestone is invoiced as 2,625 sats including the 125 sat fee), which stays behind on payout release."
  }
];

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-gray-950 hover:bg-gray-50/50 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-brand-500" : ""}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] border-t border-gray-50 p-6" : "max-h-0 overflow-hidden"}`}>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">{answer}</p>
      </div>
    </div>
  );
}

// Mock news data representing "Latest news about Bitlance"
const MOCK_NEWS = [
  {
    id: "n1",
    title:
      "Bitlance Announces $5M Seed Round to Accelerate Bitcoin Freelance Platform",
    category: "Press releases",
    date: "June 28, 2026",
    link: "#",
  },
  {
    id: "n2",
    title:
      "The 2026 Bitlance Global Freelancer Income Report: Sats Earnings Grow by 84%",
    category: "Research",
    date: "June 15, 2026",
    link: "#",
  },
  {
    id: "n3",
    title:
      "Bitlance Featured on Nasdaq: The Future of Global Payroll via Lightning Network",
    category: "Bitlance in the news",
    date: "May 29, 2026",
    link: "#",
  },
  {
    id: "n4",
    title:
      "How Decentralized Identity (Nostr/DID) is Revolutionizing Professional Portfolios",
    category: "Research",
    date: "May 12, 2026",
    link: "#",
  },
  {
    id: "n5",
    title:
      "BitLance Core Updates: Milestone-Based Lightning Escrow is Now Fully Live",
    category: "Press releases",
    date: "April 24, 2026",
    link: "#",
  },
  {
    id: "n6",
    title:
      "Forbes: How Bitcoin Freelancing Solves the Cross-Border Payment Nightmare",
    category: "Bitlance in the news",
    date: "March 18, 2026",
    link: "#",
  },
];

export function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // News filtering state
  const [activeNewsTab, setActiveNewsTab] = useState<string>("Press releases");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    // Fetch users
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error);

    // Fetch published articles
    fetch("/api/articles?status=published")
      .then((r) => r.json())
      .then((data) => {
        // Sort articles by date descending
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(b.published_at || b.created_at).getTime() -
            new Date(a.published_at || a.created_at).getTime(),
        );
        setArticles(sorted);
      })
      .catch(console.error);
  }, []);

  // Filter articles based on active category tab
  const filteredArticles = articles.filter((article) => {
    if (activeCategory === "all") return true;
    return article.category_id === activeCategory;
  });

  // Calculate featured article (always the latest article within the filtered set, or overall)
  const featured = filteredArticles[0];
  const listArticles = filteredArticles.slice(1);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(listArticles.length / pageSize));

  // Handle page limits when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedArticles = listArticles.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Filtered news items
  const filteredNews = MOCK_NEWS.filter((n) => n.category === activeNewsTab);

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Resources";
  };

  const getAuthor = (authorId: string) => {
    return users.find((u) => u.id === authorId) || {
      name: "Bitlance Team",
      avatar: "https://i.pravatar.cc/150?u=admin",
    };
  };

  const getReadingTime = (article: any) => {
    if (article.reading_time) return article.reading_time;
    const text = article.content ? article.content.replace(/<[^>]+>/g, "") : "";
    const words = text.trim().split(/\s+/).length || 1;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const activeCategoryName = activeCategory === "all"
    ? ""
    : (categories.find((c) => c.id === activeCategory)?.name || "");

  const dynamicTitle = activeCategoryName
    ? `${activeCategoryName} Guides & Insights - BitLance`
    : "Blog - BitLance";

  const dynamicDescription = activeCategoryName
    ? `Explore vetted articles, tutorials, and career insights about ${activeCategoryName} in the Bitcoin economy on BitLance.`
    : "Insights, engineering updates, and thoughtful guides from the team at BitLance.";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-brand-500 selection:text-white">
      <SEO
        title={activeCategoryName ? `${activeCategoryName} Guides & Insights - BitLance` : "BitLance - Vetted Remote Bitcoin Jobs & Freelance Marketplace"}
        description={activeCategoryName ? `Explore vetted articles, tutorials, and career insights about ${activeCategoryName} in the Bitcoin economy on BitLance.` : "Hire vetted global remote talent or find remote Bitcoin jobs. Instant global micro-payroll via Lightning Network, secure milestone-based escrows, and professional developers."}
        orgSchema={true}
        breadcrumbs={activeCategoryName ? [{ name: "Blog", item: "/" }, { name: activeCategoryName, item: `/?category=${activeCategory}` }] : [{ name: "Blog", item: "/" }]}
        faqs={HOMEPAGE_FAQS}
        canonicalUrl="https://blog.bitlance.work/"
      />
      <Navigation />

      {/* Upwork-style Secondary Sub-navigation Bar */}
      <div className="border-b border-gray-100 bg-white text-sm py-3 px-4 sm:px-6 lg:px-8 sticky top-16 z-40 shadow-sm/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
            <span className="text-gray-900 font-bold border-r border-gray-200 pr-6 mr-1">
              Blog Home
            </span>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-950 transition-colors py-1">
                Categories
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => setActiveCategory("all")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-brand-600 font-medium"
                >
                  All Topics
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-brand-600 font-medium"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Types Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-950 transition-colors py-1">
                Content Types
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Guides & Tutorials
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Case Studies
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Engineering Log
                </a>
              </div>
            </div>

            {/* Featured Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-950 transition-colors py-1">
                Featured
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Editor's Picks
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Popular Now
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium md:text-right">
            New to Bitcoin work?{" "}
            <a
              href="https://www.bitlance.work/signup"
              className="text-brand-600 hover:text-brand-700 hover:underline"
            >
              Learn how to start freelancing
            </a>{" "}
            or{" "}
            <a
              href="https://www.bitlance.work/signup"
              className="text-brand-600 hover:text-brand-700 hover:underline"
            >
              hire freelancers
            </a>
            .
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Main Title Banner matching Upwork Header Style */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight mb-4">
            Bitlance Blog
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-light">
            Read updates on Bitlance's products, borderless work initiatives,
            and Bitcoin partnerships to get insight into the world's
            decentralized work marketplace.
          </p>
        </div>

        {/* Dynamic Category Horizontal Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto gap-8 mb-12 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={`pb-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeCategory === "all"
                ? "border-brand-500 text-gray-950"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pb-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeCategory === cat.id
                  ? "border-brand-500 text-gray-950"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Hero / Featured Article Layout */}
        {featured && (
          <div className="mb-20 lg:mb-28 group">
            <Link
              to={`/article/${featured.slug || featured.id}`}
              className="block"
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in">
                  <div className="text-brand-600 text-xs font-bold uppercase tracking-wider mb-3">
                    {getCategoryName(featured.category_id)}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight mb-5 group-hover:text-brand-500 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3 font-medium">
                    {featured.subtitle ||
                      featured.content
                        ?.replace(/<[^>]+>/g, "")
                        .substring(0, 180)}
                    ...
                  </p>
                  
                  {/* Premium Author / Reading Time Row */}
                  <div className="flex items-center gap-3">
                    <img
                      src={getAuthor(featured.author_id).avatar}
                      alt={getAuthor(featured.author_id).name}
                      className="w-10 h-10 rounded-full border border-gray-100 shadow-sm object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-950">
                        {getAuthor(featured.author_id).name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mt-0.5">
                        <span>
                          {new Date(
                            featured.published_at || featured.created_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{getReadingTime(featured)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 order-1 lg:order-2">
                  <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                    <img
                      src={
                        featured.featured_image ||
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
                      }
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Main 3-Column Articles Grid */}
        {displayedArticles.length > 0 && (
          <div className="mb-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {displayedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.slug || article.id}`}
                  className="group flex flex-col h-full bg-white border border-gray-100 rounded-[2rem] p-5 hover:shadow-lg hover:border-gray-200/60 hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  <div className="aspect-[16/10.5] rounded-[1.5rem] overflow-hidden bg-gray-50 mb-5 border border-gray-100 shadow-sm shrink-0">
                    <img
                      src={
                        article.featured_image ||
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="text-brand-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {getCategoryName(article.category_id)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-2.5 leading-snug group-hover:text-brand-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2 flex-grow font-medium">
                    {article.subtitle ||
                      article.content
                        ?.replace(/<[^>]+>/g, "")
                        .substring(0, 120)}
                    ...
                  </p>
                  
                  {/* Card Author & Time Metadata */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                    <img
                      src={getAuthor(article.author_id).avatar}
                      alt={getAuthor(article.author_id).name}
                      className="w-8 h-8 rounded-full border border-gray-100 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-950 truncate">
                        {getAuthor(article.author_id).name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 mt-0.5">
                        <span>
                          {new Date(
                            article.published_at || article.created_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{getReadingTime(article)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination block - matching Upwork layout directly */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-5 py-2 text-sm font-semibold rounded-full border border-gray-200 transition-colors ${
                    currentPage === 1
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  Back
                </button>
                <div className="text-sm font-bold text-gray-700">
                  {currentPage} <span className="text-gray-300 mx-1">/</span>{" "}
                  {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors text-white ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-brand-500 hover:bg-brand-600 shadow-sm"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section Heading: Latest news about Bitlance */}
        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 mb-20 lg:mb-28">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
              Latest news about Bitlance
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Supporting you with data, trends, and insights you need to succeed
              today and prepare for tomorrow.
            </p>
          </div>

          {/* Mini tabs inside latest news */}
          <div className="flex border-b border-gray-200/60 overflow-x-auto gap-8 mb-8 scrollbar-none">
            {["Press releases", "Research", "Bitlance in the news"].map(
              (newsTab) => (
                <button
                  key={newsTab}
                  onClick={() => setActiveNewsTab(newsTab)}
                  className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                    activeNewsTab === newsTab
                      ? "border-brand-500 text-gray-950"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {newsTab}
                </button>
              ),
            )}
          </div>

          {/* News Card deck */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {news.date}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-6 leading-snug line-clamp-3">
                  {news.title}
                </h4>
                <a
                  href={news.link}
                  className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:text-brand-700 transition-colors mt-auto"
                >
                  Read news <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>



        {/* High-Impact Value Proposition Section */}
        <section className="bg-gradient-to-br from-[#FFFBF7] to-white rounded-[2rem] border border-brand-100 p-6 sm:p-10 mb-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-100/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 tracking-wider uppercase mb-4 shadow-xs">
                <Zap className="w-3 h-3 text-brand-500 fill-brand-100 stroke-[2.5] animate-pulse" /> Vetted Remote Bitcoin Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-3">
                Hire Vetted Talent or Find <br className="hidden sm:inline" />
                <span className="text-brand-600">Remote Bitcoin Jobs</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 max-w-lg">
                BitLance is the premier global platform matching top remote engineers, designers, and specialists with innovative employers. Projects are organized into milestone-based Lightning escrows—ensuring payment security for both sides with instant, direct payouts upon client approval.
              </p>
              
              {/* Dual Calls-To-Action (CTAs) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://www.bitlance.work/signup" 
                  className="inline-flex items-center justify-center bg-gray-900 text-white font-bold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm text-sm group text-center"
                >
                  Hire Bitcoin Talent
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="https://www.bitlance.work/signup" 
                  className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-xs text-sm text-center"
                >
                  Find Remote Work
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              {/* Trust badges and visually engaging panel */}
              <div className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Verified Proof-of-Work Vetting</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Every developer, designer, and writer undergoes strict skill and communication assessment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Direct Payouts via Lightning</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">No withdraw steps or delays. When the client approves the completed milestone, sats flow instantly to your preferred Lightning address.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Milestone Lightning Escrows</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Secured per milestone. Freelancers keep 100% of their earnings with zero deductions while clients pay a flat 5% platform fee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section with Structured Schema Data */}
        <section className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 mb-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Find answers to the most common questions about hiring vetted talent and freelancing on BitLance.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {HOMEPAGE_FAQS.map((faq, idx) => (
              <FaqAccordionItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
