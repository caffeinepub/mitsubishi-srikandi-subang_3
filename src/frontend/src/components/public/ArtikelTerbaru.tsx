import { useNavigate } from '@tanstack/react-router';
import { FileText } from 'lucide-react';

export default function ArtikelTerbaru() {
  const navigate = useNavigate();

  const articles = [
    { id: 1, title: 'Tips Memilih Mobil Keluarga yang Tepat', slug: 'tips-memilih-mobil-keluarga' },
    { id: 2, title: 'Keunggulan Mitsubishi Xpander', slug: 'keunggulan-mitsubishi-xpander' },
    { id: 3, title: 'Cara Merawat Mobil Agar Tetap Prima', slug: 'cara-merawat-mobil' },
    { id: 4, title: 'Promo Mitsubishi Bulan Ini', slug: 'promo-mitsubishi-bulan-ini' },
    { id: 5, title: 'Simulasi Kredit Mobil Mitsubishi', slug: 'simulasi-kredit-mobil' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#C90010]">Artikel Terbaru</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => navigate({ to: '/blog/$slug', params: { slug: article.slug } })}
              className="w-full flex items-center space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <FileText className="text-[#C90010]" size={24} />
              <span className="text-gray-800 hover:text-[#C90010] font-medium">{article.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
