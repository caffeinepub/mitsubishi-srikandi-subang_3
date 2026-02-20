import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchProduk() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/mobil-keluarga?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#C90010]">Cari Produk</h2>
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Cari mobil yang Anda inginkan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="bg-[#C90010] hover:bg-[#A00008]">
            <Search size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}
