import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import type { SearchIndexEntry, SearchResults } from "@/hooks/useSearchIndex";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Car,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Constants ───────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

const TAB_LABELS = [
  { key: "all", label: "Semua" },
  { key: "vehicle", label: "Kendaraan" },
  { key: "promo", label: "Promo" },
  { key: "article", label: "Artikel" },
] as const;

type TabKey = (typeof TAB_LABELS)[number]["key"];

const TYPE_BADGE: Record<SearchIndexEntry["entryType"], string> = {
  vehicle: "bg-red-100 text-red-700 border-red-200",
  promo: "bg-amber-100 text-amber-700 border-amber-200",
  article: "bg-blue-100 text-blue-700 border-blue-200",
};

const TYPE_ICON: Record<SearchIndexEntry["entryType"], React.ReactNode> = {
  vehicle: <Car size={14} />,
  promo: <Tag size={14} />,
  article: <FileText size={14} />,
};

// ── Helper ──────────────────────────────────────────────────
function paginate<T>(arr: T[], page: number): T[] {
  return arr.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
}

function totalPages(arr: unknown[]): number {
  return Math.ceil(arr.length / ITEMS_PER_PAGE);
}

// ── ResultCard ───────────────────────────────────────────────
function ResultCard({
  entry,
  index,
}: {
  entry: SearchIndexEntry;
  index: number;
}) {
  return (
    <motion.div
      data-ocid={`search_page.item.${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-3"
    >
      {/* Badge row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_BADGE[entry.entryType]}`}
        >
          {TYPE_ICON[entry.entryType]}
          {entry.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 text-base leading-snug">
        {entry.title}
      </h3>

      {/* Summary */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
        {entry.summary}
      </p>

      {/* CTA */}
      <div className="mt-auto pt-1">
        <button
          type="button"
          onClick={() => {
            window.location.href = entry.url;
          }}
          className="text-sm font-semibold text-[#C90010] hover:underline transition-colors inline-flex items-center gap-1"
        >
          Lihat Detail →
        </button>
      </div>
    </motion.div>
  );
}

// ── PaginationBar ────────────────────────────────────────────
function PaginationBar({
  page,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <Button
        data-ocid="search_page.pagination_prev"
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        Sebelumnya
      </Button>
      <span className="text-sm text-gray-500">
        {page} / {total}
      </span>
      <Button
        data-ocid="search_page.pagination_next"
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page === total}
        className="flex items-center gap-1"
      >
        Selanjutnya
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function SearchPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const urlQuery = (searchParams?.q as string) ?? "";

  const { search } = useSearchIndex();

  const [inputValue, setInputValue] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input when URL changes
  useEffect(() => {
    setInputValue(urlQuery);
    setPage(1);
  }, [urlQuery]);

  const results: SearchResults = useMemo(
    () => search(urlQuery),
    [search, urlQuery],
  );

  const allResults: SearchIndexEntry[] = useMemo(
    () => [...results.vehicles, ...results.promos, ...results.articles],
    [results],
  );

  const totalCount =
    results.vehicles.length + results.promos.length + results.articles.length;

  // Intent detection for notice chip
  const promoIntentWords = ["promo", "diskon", "dp"];
  const articleIntentWords = ["review", "tips", "cara"];
  const q = urlQuery.toLowerCase();
  const showPromoIntent = promoIntentWords.some((w) => q.includes(w));
  const showArticleIntent = articleIntentWords.some((w) => q.includes(w));

  // Active tab items
  const tabItems: SearchIndexEntry[] = useMemo(() => {
    if (activeTab === "vehicle") return results.vehicles;
    if (activeTab === "promo") return results.promos;
    if (activeTab === "article") return results.articles;
    return allResults;
  }, [activeTab, results, allResults]);

  const pages = totalPages(tabItems);
  const visibleItems = paginate(tabItems, page);

  // Reset page when tab changes
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleNewSearch = () => {
    const q = inputValue.trim();
    if (q) navigate({ to: "/search", search: { q } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNewSearch();
  };

  return (
    <main
      data-ocid="search_page.section"
      className="min-h-screen bg-gray-50 pb-16"
    >
      {/* Top search bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Back link */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C90010] transition-colors mb-5"
          >
            <ArrowLeft size={15} />
            Kembali ke Beranda
          </button>

          {/* Search title */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {urlQuery ? (
                  <>
                    Hasil pencarian untuk{" "}
                    <span className="text-[#C90010]">
                      &ldquo;{urlQuery}&rdquo;
                    </span>
                  </>
                ) : (
                  "Pencarian"
                )}
              </h1>
              {urlQuery && (
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount} hasil ditemukan
                </p>
              )}
            </div>

            {/* Refine search input */}
            <div className="flex items-center gap-2 w-full md:w-96">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  data-ocid="search_page.search_input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ubah kata kunci..."
                  className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C90010]/30 focus:border-[#C90010]"
                />
              </div>
              <Button
                onClick={handleNewSearch}
                className="bg-[#C90010] hover:bg-[#A80010] text-white h-10 px-4 rounded-xl text-sm"
              >
                Cari
              </Button>
            </div>
          </div>

          {/* Intent chips */}
          {(showPromoIntent || showArticleIntent) && (
            <div className="flex items-center gap-2 mt-3">
              {showPromoIntent && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 text-xs">
                  Menampilkan hasil promo teratas
                </Badge>
              )}
              {showArticleIntent && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs">
                  Menampilkan artikel teratas
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {urlQuery && totalCount === 0 ? (
          // Empty state
          <motion.div
            data-ocid="search_page.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Search size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Tidak ada hasil untuk &ldquo;{urlQuery}&rdquo;
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Coba gunakan kata kunci lain, seperti nama kendaraan, kategori,
              atau jenis promo.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Xpander", "Pajero Sport", "Promo DP", "L300"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    navigate({ to: "/search", search: { q: tag } })
                  }
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#C90010] hover:text-[#C90010] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        ) : !urlQuery ? (
          // No query state
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 text-gray-400"
          >
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-base">
              Masukkan kata kunci untuk mencari kendaraan, promo, atau artikel.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Tabs */}
            <div
              data-ocid="search_page.tab"
              className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 w-fit mb-8 shadow-sm overflow-x-auto"
            >
              {TAB_LABELS.map(({ key, label }) => {
                const count =
                  key === "all"
                    ? totalCount
                    : key === "vehicle"
                      ? results.vehicles.length
                      : key === "promo"
                        ? results.promos.length
                        : results.articles.length;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTabChange(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === key
                        ? "bg-[#C90010] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        activeTab === key
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results grid */}
            <AnimatePresence mode="wait">
              {visibleItems.length > 0 ? (
                <motion.div
                  key={`${activeTab}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {visibleItems.map((entry, i) => (
                    <ResultCard key={entry.id} entry={entry} index={i + 1} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-400"
                >
                  <p>Tidak ada hasil pada kategori ini.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <PaginationBar
              page={page}
              total={pages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(pages, p + 1))}
            />
          </>
        )}
      </div>
    </main>
  );
}
