import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default function MobilNiagaPage() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Light Duty', slug: 'light-duty', description: 'Kendaraan niaga ringan untuk kebutuhan distribusi' },
    { name: 'Medium Duty', slug: 'medium-duty', description: 'Kendaraan niaga menengah untuk angkutan sedang' },
    { name: 'Tractor Head', slug: 'tractor-head', description: 'Kendaraan niaga berat untuk angkutan besar' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => navigate({ to: '/mobil-niaga/$kategori', params: { kategori: category.slug } })}
            className="w-full text-left"
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Truck className="mx-auto mb-4 text-[#F1C40F]" size={64} />
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
