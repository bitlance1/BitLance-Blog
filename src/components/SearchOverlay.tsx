import { useState, useEffect } from "react";
import { Search, X, FileText, Newspaper, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch articles and users when overlay opens
  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/articles?status=published")
      .then((r) => r.json())
      .then((data) => setArticles(data))
      .catch(console.error);

    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, [isOpen]);

  // Compute filtered results
  const q = query.toLowerCase().trim();
  const filteredResults = q.length === 0 ? [] : articles.filter((article) => {
    return (
      (article.title || "").toLowerCase().includes(q) ||
      (article.subtitle || "").toLowerCase().includes(q) ||
      (article.content || "").toLowerCase().includes(q)
    );
  }).slice(0, 5);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Handle keyboard shortcuts (Escape to close, arrows to select, enter to go)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        if (filteredResults.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredResults.length);
        }
      } else if (e.key === "ArrowUp") {
        if (filteredResults.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        }
      } else if (e.key === "Enter") {
        if (filteredResults.length > 0 && activeIndex >= 0 && activeIndex < filteredResults.length) {
          e.preventDefault();
          const target = filteredResults[activeIndex];
          navigate(`/article/${target.slug || target.id}`);
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, filteredResults, activeIndex, navigate]);

  if (!isOpen) return null;

  const getAuthorName = (authorId: string) => {
    const user = users.find((u) => u.id === authorId);
    return user ? user.name : "Bitlance Team";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-16 sm:pt-24 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search container */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center border-b border-gray-100 px-4">
              <Search className="h-5 w-5 text-gray-400 stroke-[2] shrink-0" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent p-5 text-lg text-gray-900 placeholder:text-gray-400 outline-none"
                placeholder="Search articles, guides, and tutorials..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5 stroke-[2]" />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto px-4 py-6 bg-gray-50/50 flex-1">
              {query.length === 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 px-2">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2 mb-8 px-2">
                    {["Lightning Network", "Cold Outreach", "Invoicing", "Taxes"].map((term) => (
                      <button 
                        key={term} 
                        onClick={() => setQuery(term)} 
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm active:scale-95"
                      >
                        <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                        {term}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 px-2">Suggested Topics</h3>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setQuery("Client Acquisition")} 
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200/50 transition-all group text-left"
                    >
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                         <Newspaper className="h-5 w-5 stroke-[2]" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Client Acquisition</h4>
                         <p className="text-xs text-gray-500 font-medium">Guides to finding and closing Bitcoin-native clients</p>
                       </div>
                    </button>
                    <button 
                      onClick={() => setQuery("Lightning Network")} 
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-200/50 transition-all group text-left"
                    >
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors">
                         <Zap className="h-5 w-5 stroke-[2]" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Lightning Network</h4>
                         <p className="text-xs text-gray-500 font-medium">Setting up nodes and receiving instant invoices</p>
                       </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-2">
                      Search Results ({filteredResults.length})
                    </h3>
                    <div className="space-y-1">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((art, idx) => {
                          const isSelected = idx === activeIndex;
                          return (
                            <Link
                              key={art.id}
                              to={`/article/${art.slug || art.id}`}
                              onClick={onClose}
                              className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-150 group animate-fade-in ${
                                isSelected
                                  ? "bg-white ring-2 ring-brand-500/10 border border-brand-200 shadow-md translate-x-1"
                                  : "hover:bg-white/80 hover:shadow-xs hover:border-gray-200 border border-transparent"
                              }`}
                            >
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                isSelected ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-500"
                              }`}>
                                <FileText className="h-5 w-5 stroke-[2]" />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <h4 className={`text-sm font-bold text-gray-900 transition-colors truncate ${
                                  isSelected ? "text-brand-600" : "group-hover:text-brand-600"
                                }`}>
                                  {art.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                                  {art.subtitle || art.content?.replace(/<[^>]+>/g, "").substring(0, 100)}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 font-semibold">
                                  <span className="text-gray-600">
                                    {getAuthorName(art.author_id)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {art.reading_time || `${Math.max(1, Math.ceil((art.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 200))} min read`}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-gray-400 text-sm font-medium">
                          No articles found matching "{query}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold select-none">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">↑↓</kbd> to navigate</span>
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">enter</kbd> to select</span>
               </div>
               <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
