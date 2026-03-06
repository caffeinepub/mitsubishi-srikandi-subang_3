import { useSearchIndex } from "@/hooks/useSearchIndex";
import type { SearchIndexEntry } from "@/hooks/useSearchIndex";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const TYPE_LABEL: Record<SearchIndexEntry["entryType"], string> = {
  vehicle: "Kendaraan",
  promo: "Promo",
  article: "Artikel",
};

const TYPE_COLOR: Record<SearchIndexEntry["entryType"], string> = {
  vehicle: "bg-red-100 text-red-700",
  promo: "bg-amber-100 text-amber-700",
  article: "bg-blue-100 text-blue-700",
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchProduk() {
  const navigate = useNavigate();
  const { getAutosuggestions } = useSearchIndex();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    debouncedQuery.length >= 2 ? getAutosuggestions(debouncedQuery) : [];

  // Group suggestions by type
  const grouped = {
    vehicle: suggestions.filter((s) => s.entryType === "vehicle"),
    promo: suggestions.filter((s) => s.entryType === "promo"),
    article: suggestions.filter((s) => s.entryType === "article"),
  };

  const hasResults = suggestions.length > 0;

  // Open dropdown when results arrive
  useEffect(() => {
    if (debouncedQuery.length >= 2 && hasResults) {
      setOpen(true);
    } else if (debouncedQuery.length < 2) {
      setOpen(false);
    }
  }, [debouncedQuery, hasResults]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(() => {
    const q = query.trim();
    if (q) {
      setOpen(false);
      navigate({ to: "/search", search: { q } });
    }
  }, [query, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setOpen(false);
  };

  const handleSuggestionClick = (entry: SearchIndexEntry) => {
    setOpen(false);
    setQuery(entry.title);
    window.location.href = entry.url;
  };

  const handleShowAll = () => {
    const q = query.trim();
    if (q) {
      setOpen(false);
      navigate({ to: "/search", search: { q } });
    }
  };

  const clearQuery = () => {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <section
      data-ocid="search.section"
      className="py-20 bg-[#E5E7EB] relative overflow-hidden"
    >
      {/* Subtle decorative circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#C90010]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold tracking-widest text-[#C90010] uppercase mb-3">
            Stay Connected
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Temukan Kendaraan Impian Anda
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            Cari kendaraan, promo menarik, atau artikel informatif
          </p>
        </motion.div>

        {/* Search bar container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
          ref={containerRef}
        >
          <div className="relative">
            {/* Search input row */}
            <div className="flex items-center bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-visible focus-within:ring-2 focus-within:ring-[#C90010]/30 transition-shadow duration-200">
              {/* Search icon */}
              <div className="pl-5 pr-3 flex-shrink-0 text-gray-400">
                <Search size={22} />
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                data-ocid="search.search_input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (debouncedQuery.length >= 2 && hasResults) setOpen(true);
                }}
                placeholder="Cari mobil, promo atau artikel..."
                className="flex-1 h-14 bg-transparent text-gray-900 placeholder-gray-400 text-base focus:outline-none pr-2"
                aria-label="Cari produk"
                aria-autocomplete="list"
                aria-expanded={open}
              />

              {/* Clear button */}
              {query && (
                <button
                  onClick={clearQuery}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Hapus pencarian"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}

              {/* Submit button */}
              <button
                data-ocid="search.primary_button"
                onClick={handleSearch}
                type="button"
                className="m-2 px-6 h-10 bg-[#C90010] hover:bg-[#A80010] text-white font-semibold rounded-xl text-sm transition-colors duration-200 flex items-center gap-2 flex-shrink-0 shadow-md"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>

            {/* Autosuggestion dropdown */}
            <AnimatePresence>
              {open && hasResults && (
                <motion.div
                  data-ocid="search.dropdown_menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  {(["vehicle", "promo", "article"] as const).map((type) => {
                    const items = grouped[type];
                    if (items.length === 0) return null;

                    const globalOffset =
                      type === "vehicle"
                        ? 0
                        : type === "promo"
                          ? grouped.vehicle.length
                          : grouped.vehicle.length + grouped.promo.length;

                    return (
                      <div key={type}>
                        {/* Section header */}
                        <div className="px-4 pt-3 pb-1">
                          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                            {TYPE_LABEL[type]}
                          </span>
                        </div>
                        {items.map((entry, localIdx) => {
                          const globalIdx = globalOffset + localIdx + 1;
                          return (
                            <button
                              key={entry.id}
                              data-ocid={`search.item.${globalIdx}`}
                              type="button"
                              onClick={() => handleSuggestionClick(entry)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors duration-100 text-left group"
                            >
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLOR[type]}`}
                              >
                                {entry.category}
                              </span>
                              <span className="text-sm text-gray-800 font-medium group-hover:text-[#C90010] transition-colors truncate">
                                {entry.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Show all link */}
                  <div className="border-t border-gray-100 px-4 py-3">
                    <button
                      type="button"
                      onClick={handleShowAll}
                      className="text-sm text-[#C90010] font-semibold hover:underline transition-colors"
                    >
                      Lihat semua hasil untuk &ldquo;{query}&rdquo; →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap gap-2 mt-5 justify-center">
            {[
              "Xpander",
              "Pajero Sport",
              "Promo DP Ringan",
              "Canter",
              "L300",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  navigate({ to: "/search", search: { q: tag } });
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#C90010] hover:text-[#C90010] transition-colors duration-150 shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
