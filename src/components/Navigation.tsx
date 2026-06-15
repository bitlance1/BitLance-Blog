import { useState, useEffect } from "react";
import { Bitcoin, Menu, Search } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";

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
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Bitcoin className="h-5 w-5 stroke-[1.5]" />
            </div>
            <span className="heading-display text-xl font-bold tracking-tight text-gray-900">Bitlance</span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="/" className="text-gray-900 transition-colors font-semibold">Blog</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
            <span>Search articles...</span>
            <kbd className="hidden lg:inline-flex ml-2 items-center rounded border border-gray-300 bg-white px-1.5 text-[10px] font-medium text-gray-500">
              ⌘K
            </kbd>
          </button>
          
          <div className="hidden md:flex items-center gap-4 ml-2">
            <a href="/profile" className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <img src="https://i.pravatar.cc/150?u=user_1" alt="Profile" className="w-5 h-5 rounded-full" />
              <span>Reader Profile</span>
            </a>
          </div>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Search className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </nav>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
