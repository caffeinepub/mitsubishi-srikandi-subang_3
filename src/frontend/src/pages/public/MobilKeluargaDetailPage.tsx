import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllVehicleCatalogs } from '@/hooks/usePublicData';
import VariantColorSelector from '@/components/public/VariantColorSelector';
import ProductInteractions from '@/components/public/ProductInteractions';

export default function MobilKeluargaDetailPage() {
  const { slug } = useParams({ from: '/mobil-keluarga/$slug' });
  const { data: catalogs } = useGetAllVehicleCatalogs();

  const catalog = catalogs?.find(
    (c) => c.vehicle.vehicleName.toLowerCase().replace(/\s+/g, '-') === slug
  );

  const [selectedVariantId, setSelectedVariantId] = useState<bigint | null>(
    catalog?.variants[0]?.id || null
  );
  const [selectedColorId, setSelectedColorId] = useState<bigint | null>(
    catalog?.colors[0]?.id || null
  );

  if (!catalog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Kendaraan tidak ditemukan</p>
      </div>
    );
  }

  const selectedVariant = catalog.variants.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.overridePrice || catalog.vehicle.basePrice;

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const handleSelectionChange = (variantId: bigint, colorId: bigint) => {
    setSelectedVariantId(variantId);
    setSelectedColorId(colorId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-4">
            <img
              src="/assets/vehicle-placeholder.dim_800x600.png"
              alt={catalog.vehicle.vehicleName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <ProductInteractions vehicleId={catalog.vehicle.id} />
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{catalog.vehicle.vehicleName}</h1>
            <p className="text-gray-600 mb-6">{catalog.vehicle.description}</p>
            <div className="text-3xl font-bold text-red-600 mb-6">
              {formatPrice(currentPrice)}
            </div>

            <VariantColorSelector
              variants={catalog.variants}
              colors={catalog.colors}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">Hubungi Sales</Button>
            <Button variant="outline" className="flex-1">
              Simulasi Kredit
            </Button>
            <Button variant="outline">Download Brosur</Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
            <TabsTrigger value="features">Fitur</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {catalog.specifications.length > 0 ? (
                catalog.specifications.map((spec) => (
                  <div key={spec.id.toString()} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Belum ada spesifikasi</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {catalog.features.length > 0 ? (
                catalog.features.map((feature) => (
                  <div key={feature.id.toString()} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{feature.name}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Belum ada fitur</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
