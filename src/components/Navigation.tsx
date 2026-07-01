import { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import logoUrl from "../assets/images/bitlance_logo_1782869809232.jpg";

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global cmd+k shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 group">
            <img 
              src={logoUrl} 
              alt="Bitlance Logo" 
              className="h-8 w-8 rounded-lg object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="heading-display text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-brand-600">Bitlance</span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="/" className="text-gray-900 transition-colors font-semibold">Blog</a>
          </div>
        </div>

        <div className="flex items-center">
          {/* Repositioned & Enhanced Search Card (occupying the space previously taken by Reader Profile) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100/80 px-4 py-2 text-sm text-gray-500 transition-all duration-200 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-98"
          >
            <Search className="h-4 w-4 stroke-[1.5] text-gray-400" />
            <span className="font-medium text-gray-600 sm:inline hidden">Search articles...</span>
            <span className="font-medium text-gray-600 sm:hidden inline">Search...</span>
            <kbd className="hidden lg:inline-flex ml-2 items-center rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </nav>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
