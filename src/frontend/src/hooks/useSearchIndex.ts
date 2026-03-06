import { useCallback, useMemo } from "react";

export interface SearchIndexEntry {
  id: number;
  entryType: "vehicle" | "promo" | "article";
  title: string;
  keywords: string;
  summary: string;
  url: string;
  image: string;
  category: string;
  updatedAt: number;
}

export interface SearchResults {
  vehicles: SearchIndexEntry[];
  promos: SearchIndexEntry[];
  articles: SearchIndexEntry[];
}

export function buildSearchIndex(): SearchIndexEntry[] {
  return [
    // ── Mobil Keluarga ──
    {
      id: 1,
      entryType: "vehicle",
      title: "Mitsubishi Xpander",
      keywords: "xpander mpv minivan keluarga 7 penumpang",
      summary: "MPV stylish dengan kabin lega dan teknologi terkini",
      url: "/mobil-keluarga/xpander",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 2,
      entryType: "vehicle",
      title: "Mitsubishi Xpander Cross",
      keywords: "xpander cross crossover mpv ground clearance tinggi keluarga",
      summary: "Crossover MPV tangguh dengan ground clearance tinggi",
      url: "/mobil-keluarga/xpander-cross",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 3,
      entryType: "vehicle",
      title: "Mitsubishi Pajero Sport",
      keywords: "pajero sport suv premium bertenaga 4wd diesel",
      summary: "SUV premium bertenaga tinggi dengan tampilan gagah",
      url: "/mobil-keluarga/pajero-sport",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 4,
      entryType: "vehicle",
      title: "Mitsubishi Pajero Sport Dakar",
      keywords: "pajero sport dakar ultimate suv premium fitur lengkap",
      summary: "Varian tertinggi Pajero Sport dengan fitur premium lengkap",
      url: "/mobil-keluarga/pajero-sport-dakar",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 5,
      entryType: "vehicle",
      title: "Mitsubishi Outlander",
      keywords: "outlander suv 7 penumpang hybrid phev all wheel drive",
      summary: "SUV 7-penumpang dengan teknologi hybrid canggih",
      url: "/mobil-keluarga/outlander",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 6,
      entryType: "vehicle",
      title: "Mitsubishi Eclipse Cross",
      keywords: "eclipse cross compact suv sporty futuristik coupe",
      summary: "Compact SUV sporty dengan desain futuristik",
      url: "/mobil-keluarga/eclipse-cross",
      image: "",
      category: "Mobil Keluarga",
      updatedAt: Date.now(),
    },
    {
      id: 7,
      entryType: "vehicle",
      title: "Mitsubishi Colt T120SS",
      keywords: "colt t120ss pick up niaga ringan usaha bisnis",
      summary: "Kendaraan komersial ringan andalan usaha",
      url: "/mobil-niaga/light-duty/colt-t120ss",
      image: "",
      category: "Mobil Niaga",
      updatedAt: Date.now(),
    },
    // ── Mobil Niaga ──
    {
      id: 8,
      entryType: "vehicle",
      title: "Mitsubishi L300",
      keywords: "l300 pikap pick up serbaguna usaha bisnis light duty",
      summary: "Pikap serbaguna untuk usaha dan bisnis",
      url: "/mobil-niaga/light-duty/l300",
      image: "",
      category: "Mobil Niaga - Light Duty",
      updatedAt: Date.now(),
    },
    {
      id: 9,
      entryType: "vehicle",
      title: "Mitsubishi Canter FE Series",
      keywords: "canter fe truk ringan distribusi barang medium duty",
      summary: "Truk ringan handal untuk distribusi barang",
      url: "/mobil-niaga/medium-duty/canter-fe",
      image: "",
      category: "Mobil Niaga - Medium Duty",
      updatedAt: Date.now(),
    },
    {
      id: 10,
      entryType: "vehicle",
      title: "Mitsubishi Fuso Fighter",
      keywords: "fuso fighter truk berat angkutan jarak jauh heavy duty",
      summary: "Truk berat untuk angkutan jarak jauh",
      url: "/mobil-niaga/heavy-duty/fuso-fighter",
      image: "",
      category: "Mobil Niaga - Heavy Duty",
      updatedAt: Date.now(),
    },
    // ── Promo ──
    {
      id: 11,
      entryType: "promo",
      title: "Promo Xpander DP Ringan",
      keywords: "promo xpander dp ringan cicilan diskon angsuran",
      summary: "Dapatkan kemudahan DP mulai 20 juta untuk Xpander",
      url: "/promo",
      image: "",
      category: "Promo",
      updatedAt: Date.now(),
    },
    {
      id: 12,
      entryType: "promo",
      title: "Promo Pajero Sport Spesial",
      keywords: "promo pajero sport spesial bonus aksesori diskon",
      summary: "Penawaran eksklusif Pajero Sport dengan bonus aksesori",
      url: "/promo",
      image: "",
      category: "Promo",
      updatedAt: Date.now(),
    },
    {
      id: 13,
      entryType: "promo",
      title: "Free Service 3 Tahun",
      keywords: "promo gratis service servis free dp perawatan",
      summary: "Gratis biaya servis 3 tahun untuk pembelian unit baru",
      url: "/promo",
      image: "",
      category: "Promo",
      updatedAt: Date.now(),
    },
    {
      id: 14,
      entryType: "promo",
      title: "KPR Mitsubishi Bunga Rendah",
      keywords: "promo kredit bunga rendah cicilan dp angsuran bank",
      summary: "Kredit kendaraan dengan bunga spesial mitra bank terpercaya",
      url: "/promo",
      image: "",
      category: "Promo",
      updatedAt: Date.now(),
    },
    // ── Artikel ──
    {
      id: 15,
      entryType: "article",
      title: "Review Xpander 2025: Lebih Canggih dari Sebelumnya",
      keywords: "review xpander 2025 test drive ulasan canggih",
      summary: "Kami menguji Xpander terbaru dan hasilnya memuaskan",
      url: "/blog/review-xpander-2025",
      image: "",
      category: "Artikel",
      updatedAt: Date.now(),
    },
    {
      id: 16,
      entryType: "article",
      title: "Tips Merawat Mobil Mitsubishi agar Awet",
      keywords: "tips cara merawat mobil mitsubishi perawatan servis awet",
      summary: "Panduan lengkap perawatan rutin kendaraan Mitsubishi",
      url: "/blog/tips-merawat-mobil-mitsubishi",
      image: "",
      category: "Artikel",
      updatedAt: Date.now(),
    },
    {
      id: 17,
      entryType: "article",
      title: "Perbandingan Pajero Sport vs Fortuner 2025",
      keywords: "review perbandingan pajero sport fortuner suv tips 2025",
      summary: "Duel SUV premium: Pajero Sport melawan Toyota Fortuner",
      url: "/blog/pajero-vs-fortuner-2025",
      image: "",
      category: "Artikel",
      updatedAt: Date.now(),
    },
    {
      id: 18,
      entryType: "article",
      title: "Cara Simulasi Kredit Mobil yang Tepat",
      keywords: "cara tips simulasi kredit cicilan dp angsuran beli mobil",
      summary: "Panduan menghitung cicilan kredit kendaraan sebelum membeli",
      url: "/blog/cara-simulasi-kredit",
      image: "",
      category: "Artikel",
      updatedAt: Date.now(),
    },
  ];
}

function scoreEntry(
  entry: SearchIndexEntry,
  query: string,
  intentBoostVehicle: boolean,
  intentBoostPromo: boolean,
  intentBoostArticle: boolean,
): number {
  const q = query.toLowerCase();
  const title = entry.title.toLowerCase();
  const keywords = entry.keywords.toLowerCase();
  const summary = entry.summary.toLowerCase();
  const category = entry.category.toLowerCase();

  let score = 0;

  // Title scoring
  if (title === q) score += 100;
  else if (title.startsWith(q)) score += 50;
  else if (title.includes(q)) score += 30;

  // Keyword match
  if (keywords.includes(q)) score += 20;

  // Category match
  if (category.includes(q)) score += 10;

  // Summary match
  if (summary.includes(q)) score += 5;

  // Intent boosts
  if (intentBoostVehicle && entry.entryType === "vehicle") score *= 2;
  if (intentBoostPromo && entry.entryType === "promo") score *= 2;
  if (intentBoostArticle && entry.entryType === "article") score *= 2;

  return score;
}

export function useSearchIndex() {
  const index = useMemo(() => buildSearchIndex(), []);

  const search = useCallback(
    (query: string): SearchResults => {
      const empty: SearchResults = { vehicles: [], promos: [], articles: [] };
      if (!query || query.trim().length < 2) return empty;

      const q = query.trim().toLowerCase();

      // Intent detection
      const promoKeywords = ["promo", "diskon", "dp"];
      const articleKeywords = ["review", "tips", "cara"];
      const vehicleKeywords = [
        "xpander",
        "pajero",
        "outlander",
        "eclipse",
        "l300",
        "canter",
        "fuso",
        "colt",
      ];

      const intentBoostPromo = promoKeywords.some((k) => q.includes(k));
      const intentBoostArticle = articleKeywords.some((k) => q.includes(k));
      const intentBoostVehicle =
        vehicleKeywords.some((k) => q.includes(k)) &&
        !intentBoostPromo &&
        !intentBoostArticle;

      type Scored = { entry: SearchIndexEntry; score: number };

      const scored: Scored[] = index
        .map((entry) => ({
          entry,
          score: scoreEntry(
            entry,
            q,
            intentBoostVehicle,
            intentBoostPromo,
            intentBoostArticle,
          ),
        }))
        .filter((s) => s.score > 0);

      const vehicles = scored
        .filter((s) => s.entry.entryType === "vehicle")
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.entry);

      const promos = scored
        .filter((s) => s.entry.entryType === "promo")
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.entry);

      const articles = scored
        .filter((s) => s.entry.entryType === "article")
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.entry);

      return { vehicles, promos, articles };
    },
    [index],
  );

  const getAutosuggestions = useCallback(
    (query: string): SearchIndexEntry[] => {
      if (!query || query.trim().length < 2) return [];
      const q = query.trim().toLowerCase();

      const vehicles = index
        .filter(
          (e) => e.entryType === "vehicle" && e.title.toLowerCase().includes(q),
        )
        .slice(0, 5);
      const promos = index
        .filter(
          (e) => e.entryType === "promo" && e.title.toLowerCase().includes(q),
        )
        .slice(0, 5);
      const articles = index
        .filter(
          (e) => e.entryType === "article" && e.title.toLowerCase().includes(q),
        )
        .slice(0, 5);

      return [...vehicles, ...promos, ...articles];
    },
    [index],
  );

  return { index, search, getAutosuggestions };
}
